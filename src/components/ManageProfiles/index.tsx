import * as S from '../../styles/GlobalComponents';
import { Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { IImageData, ISession } from '../../services/auth/authService';
import { userService } from '../../services/userService';
import { useRouter } from 'next/router';
import { useUsuario } from '../../common/context/Usuario';
import { Box } from '@mui/system';
import { moviesGenres } from '../../services/moviesService';

interface CreateCreateProfilesProps {
    session: ISession;
    images: IImageData[];
    setMessage: React.Dispatch<
        React.SetStateAction<{
            message: string;
            error: boolean;
        }>
    >;
    setSetingProfile: React.Dispatch<React.SetStateAction<boolean>>;
    editProfileId?: string;
}

const CreateProfiles: React.FC<CreateCreateProfilesProps> = ({
    session,
    images,
    setMessage,
    setSetingProfile,
    editProfileId,
}) => {
    const [preferences, setPreferences] = useState<string[]>([]);
    const [profileName, setProfileName] = useState('');
    const [imageData, setImageData] = useState({ id: '', data: '' });
    const router = useRouter();
    const { toSlug } = useUsuario();

    const filteredImages = (
        imgs: { _id: string; data: ArrayBuffer; contentType: string }[]
    ) => {
        return imgs.filter(img => {
            const exists = session.profiles.find(prof => {
                return prof.image._id === img._id;
            });
            return exists ? false : true;
        });
    };

    const convertImage = (bin: ArrayBuffer) => {
        const buff = Buffer.from(bin);
        return buff.toString('base64');
    };

    const validations = (
        pref: string[],
        imageInfo: { id: string; data: string },
        session: ISession
    ) => {
        if (pref.length < 6) {
            setMessage({
                message:
                    'Você deve escolher no mínimo 6 gêneros para esse perfil',
                error: true,
            });
            return false;
        }
        if (!imageInfo.id) {
            setMessage({
                message: 'Você deve escolher uma imagem para seu perfil',
                error: true,
            });
            return false;
        }

        if (session.profiles.length > 3) {
            setMessage({
                message: 'Você chegou no limite de perfis',
                error: true,
            });
            return false;
        }

        const slug = toSlug(profileName);
        const exists = session.profiles.find(prof => {
            return prof.slug === slug;
        });

        if (exists) {
            setMessage({
                message: 'Nome de perfil já usado',
                error: true,
            });
            return false;
        }
        return true;
    };

    return (
        <S.CreateProfileForm
            onSubmit={async e => {
                e.preventDefault();

                if (!validations(preferences, imageData, session)) return;

                const slug = toSlug(profileName);
                const preferencesId = preferences.map(pref => {
                    const genre = moviesGenres.find(
                        genre => genre.title === pref
                    );
                    return genre.id.toString();
                });

                let res;
                if (editProfileId) {
                    res = await userService.createNewProfile(
                        slug,
                        profileName,
                        preferencesId,
                        imageData.id,
                        session.id
                    );
                } else {
                    res = await userService.updateUserProfile(
                        slug,
                        profileName,
                        preferencesId,
                        imageData.id,
                        editProfileId,
                        session.id
                    );
                }
                setMessage({
                    message: res.body.message,
                    error: !res.ok,
                });
                if (res.ok) {
                    setSetingProfile(false);
                    router.push('/select-profile');
                }
            }}
        >
            <S.CreateProfileWrapper>
                <S.CreateProfileEditSession>
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            width: '100%',
                        }}
                    >
                        <h3>Escolha sua imagem</h3>
                        <S.CreateProfileImagesWrapper>
                            {filteredImages(images).map(image => (
                                <div
                                    key={image._id}
                                    id={image._id}
                                    onClick={() => {
                                        setImageData({
                                            id: image._id,
                                            data: convertImage(image.data),
                                        });
                                        // setImageId(e.target);
                                    }}
                                >
                                    <S.CreateProfileImageBox
                                        src={`data:image/image/png;base64,${convertImage(
                                            image.data
                                        )}`}
                                        style={{
                                            width: '100px',
                                            borderRadius: '10px',
                                        }}
                                    />
                                </div>
                            ))}
                        </S.CreateProfileImagesWrapper>
                    </div>
                    <S.CreateProfileInputsWrapper>
                        <S.LoginTextfield
                            label="Nome do perfil"
                            width="100%"
                            color="secondary"
                            variant="filled"
                            value={profileName}
                            margin="normal"
                            // helperText="O nome de usuário deve ser menor que 20 caracteres"
                            onChange={e => {
                                if (e.target.value.length < 11)
                                    setProfileName(e.target.value);
                            }}
                            inputProps={{
                                style: {
                                    color: 'var(--white)',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: '#8c8c80' },
                            }}
                            required
                        />
                        <FormControl
                            variant="filled"
                            sx={{
                                m: 1,
                                minWidth: 280,
                                margin: 0,
                            }}
                        >
                            <InputLabel
                                style={{ color: '#8c8c80' }}
                                id="demo-simple-select-autowidth-label"
                            >
                                Quais gêneros mais gosta?
                            </InputLabel>
                            <Select
                                color="secondary"
                                size="medium"
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                multiple
                                value={preferences}
                                onChange={e => {
                                    let value = e.target.value;
                                    if (typeof value === 'string') {
                                        value = value.split(',');
                                    }
                                    if (value.length < 7) setPreferences(value);
                                }}
                                SelectDisplayProps={{
                                    style: {
                                        backgroundColor: '#333',
                                        color: '#eee',
                                        borderRadius: '5px',
                                        width: '100%',
                                        maxWidth: '350px',
                                    },
                                }}
                                inputProps={{
                                    style: { color: '#eee' },
                                }}
                                label="Quais gêneros mais gosta?"
                                MenuProps={{
                                    sx: {
                                        maxHeight: '200px',
                                    },
                                }}
                                renderValue={(selected: string[]) => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map(value => (
                                            <Chip
                                                style={{
                                                    color: 'white',
                                                    backgroundColor: '#ff1111',
                                                }}
                                                key={value}
                                                label={value}
                                            />
                                        ))}
                                    </Box>
                                )}
                                required
                            >
                                {moviesGenres.map(genre => (
                                    <MenuItem value={genre.title}>
                                        {genre.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </S.CreateProfileInputsWrapper>
                </S.CreateProfileEditSession>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '32px', color: 'var(--white)' }}>
                        Seu novo perfil
                    </h2>
                    {imageData.data && (
                        <img
                            style={{
                                width: '200px',
                                borderRadius: '10px',
                                margin: '8px 0',
                            }}
                            src={`data:image/image/png;base64,${imageData.data}`}
                        />
                    )}
                    {!profileName && <p>Insira um nome...</p>}
                    {profileName && (
                        <h3
                            style={{
                                textTransform: 'uppercase',
                                fontWeight: '700',
                            }}
                        >
                            {profileName}
                        </h3>
                    )}
                </div>
            </S.CreateProfileWrapper>
            <div
                style={{
                    width: '100%',
                    textAlign: 'center',
                    marginTop: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <S.LoginButton
                    type="submit"
                    variant="contained"
                    data-testid="Entrar"
                    width="40%"
                >
                    {editProfileId && 'Editar'}
                    {!editProfileId && 'Criar'}
                </S.LoginButton>
                <S.LoginText
                    onClick={() => {
                        setSetingProfile(!setSetingProfile);
                    }}
                >
                    Voltar
                </S.LoginText>
            </div>
        </S.CreateProfileForm>
    );
};

export default CreateProfiles;
