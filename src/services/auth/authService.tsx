import { HttpClient } from '../../infra/HttpClient/HttpClient';
import { tokenService } from './tokenService';
import { ISession } from '@types';

/**
 * @4.1 Agora, que já abstraímos e criamos um servico de autenticação que envia a requisição
 * Precisamos guardar os tokens no cliente para usá-los
 * @options
 * LocalStorage - Guarda para "sempre", não muito seguro se o token tiver validade alta, mas nao pode ser acessado no back
 * SessionStorage - Guarda durante uma sessão do navegador, mais seguro, mesmo problema do back
 * Cookies - Mais seguro que localstorage
 * HTTP only Cookie - RECOMENDADO, mais seguro de todos
 */

export const authService = {
	async login({ email, password }) {
		return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
			method: 'POST',
			body: {
				email: email,
				password,
			},
		})
			.then(res => {
				const body = res.body;
				tokenService.save(res.headers.get('Authorization'));
				return body;
			})
			.then(async body => {
				if (!body.refresh_token) return body;
				await HttpClient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh`, {
					method: 'POST',
					body: {
						refresh_token: body.refresh_token,
					},
				});
				return body;
			})
			.catch(err => {
				console.log(err);
			});
	},
	async getSession(ctx = null): Promise<ISession> {
		const token = tokenService.get(ctx);
		return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/session`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			ctx,
			refresh: true,
		}).then(response => {
			if (!response.ok) throw new Error('Não autorizado');
			return response.body.data;
		});
	},
	async logout(ctx = null) {
		const token = tokenService.get(ctx);

		return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout `, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: {
				refresh_token: ctx?.req?.cookies['netflix.ref'],
			},
			refresh: false,
		}).then(response => {
			if (!response.ok) throw new Error('Falha ao fazer Logout');

			return response.body.data;
		});
	},
};
