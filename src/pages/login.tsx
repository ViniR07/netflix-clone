import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox, FormControlLabel } from '@mui/material'
import { UsuarioContext } from '../../common/context/Usuario'
import FirstHeader from '../../components/FirstHeader'
import bgImage from '../../assets/netflix-library.jpg'
import * as S from './style'

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [validity, setValidity] = useState({ email: true, password: true })
    const { email, password, checked, setChecked, setEmail, setPassword } =
        useContext(UsuarioContext)
    const history = useNavigate()

    const simpleCheck = (type, size, value) => {
        setValidity(lastVal => {
            return { ...lastVal, [type]: !(value.length < size) }
        })
    }

    return (
        <S.Background $src={bgImage}>
            <FirstHeader />
            <S.LoginContainer>
                <S.LoginForm>
                    <h1>Entrar</h1>

                    <S.LoginTextfield
                        label="Email"
                        variant="filled"
                        color="secondary"
                        value={email}
                        margin="normal"
                        onChange={e => {
                            simpleCheck('email', 10, e.target.value)
                            setEmail(e.target.value)
                        }}
                        error={!validity.email}
                        onBlur={e => {
                            simpleCheck('email', 10, e.target.value)
                        }}
                        helperText={
                            validity.email ? '' : 'Informe um Email válido'
                        }
                        FormHelperTextProps={{
                            style: {
                                color: ' var(--red-netflix)',
                                position: 'absolute',
                                transform: 'translate(0px, 57px)',
                            },
                        }}
                        inputProps={{ sx: { color: 'var(--white)' } }}
                        InputLabelProps={{ style: { color: '#8c8c80' } }}
                        type="email"
                    />
                    <div style={{ position: 'relative', width: '100%' }}>
                        <S.LoginTextfield
                            label="Senha"
                            color="secondary"
                            variant="filled"
                            value={password}
                            margin="normal"
                            error={!validity.password}
                            onBlur={e =>
                                simpleCheck('password', 4, e.target.value)
                            }
                            helperText={
                                validity.password
                                    ? ''
                                    : 'Informe uma senha maior que 4 caracteres.'
                            }
                            onChange={e => {
                                simpleCheck('password', 4, e.target.value)
                                setPassword(e.target.value)
                            }}
                            FormHelperTextProps={{
                                style: {
                                    color: ' var(--red-netflix)',
                                    position: 'absolute',
                                    transform: 'translate(0px, 57px)',
                                },
                            }}
                            inputProps={{ sx: { color: 'var(--white)' } }}
                            InputLabelProps={{ style: { color: '#8c8c80' } }}
                            type={showPassword ? 'text' : 'password'}
                        />
                        {password.length > 0 && (
                            <S.TogglePasswordVisibility
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                MOSTRAR
                            </S.TogglePasswordVisibility>
                        )}
                    </div>
                    <S.LoginButton
                        onClick={e => {
                            e.preventDefault()
                            setPassword('')
                            setEmail('')
                            history('/select-profile')
                        }}
                        disabled={
                            !validity.email ||
                            !validity.password ||
                            password.length < 1 ||
                            email.length < 1
                        }
                        type="submit"
                        variant="contained"
                        fullWidth
                        data-testid="Entrar"
                    >
                        Entrar
                    </S.LoginButton>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <FormControlLabel
                            style={{ fontSize: '8px', color: '#8C8C80' }}
                            control={
                                <Checkbox
                                    color="secondary"
                                    checked={checked}
                                    onChange={() => setChecked(!checked)}
                                />
                            }
                            label="Lembre-se de mim"
                        />
                        <S.LoginText>Esqueceu a senha?</S.LoginText>
                    </div>
                </S.LoginForm>
            </S.LoginContainer>
        </S.Background>
    )
}

export default Login
