import { authService } from './authService';
import React from 'react';
import { useRouter } from 'next/router';

export function withSession(funcao: Function) {
    return async ctx => {
        try {
            const session = await authService.getSession(ctx);
            const modifiedCtx = {
                ...ctx,
                req: {
                    ...ctx.req,
                    session,
                },
            };
            return funcao(modifiedCtx);
        } catch (error) {
            console.log(error);
            return {
                redirect: {
                    permanent: false,
                    destination: '/login/?error=401',
                },
            };
            // return {
            //     props: {},
            // };
        }
    };
}

export function useSession() {
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        authService
            .getSession()
            .then(session => {
                console.log(session);
                setSession(session);
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, []);

    return {
        data: {
            session,
        },
        error,
        loading,
    };
}

// Componente de Ordem Superior Static-pages
export function withSessionHOC(Component: React.ComponentType) {
    return function Wrapper(props) {
        const router = useRouter();
        const session = useSession();

        if (!session.loading && session.error) {
            router.push('/?error=401');
        }

        const modifiedProps = {
            ...props,
            session: session.data.session,
        };
        return <Component {...modifiedProps} />;
    };
}
