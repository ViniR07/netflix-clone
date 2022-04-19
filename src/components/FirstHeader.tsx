import { ReactComponent as Logo } from '../assets/netflix-logo.svg';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import React from 'react';

export const Header = styled.header`
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    padding: 16px 0 0 32px;
`;

const FirstHeader: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Header>
            <div style={{ cursor: 'pointer' }}>
                <Logo onClick={() => navigate(-1)} />
            </div>
        </Header>
    );
};

export default FirstHeader;
