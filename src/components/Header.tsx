import React from "react";
import Moralis from "moralis";
import styled from "styled-components";
import { PolygonButton } from "./Components.sc";
import { ReactComponent as Logo } from "../assets/polygon-matic-logo.svg";

const Header: React.FC = () => {
    const [currentUser, setCurrentUser] = React.useState(
        Moralis.User.current()
    );

    Moralis.onAccountChanged(() => {
        Moralis.User.logOut().then(() => {
            setCurrentUser(Moralis.User.current()); // this will now be null
        });
    });

    return (
        <HeaderContainer>
            <MaticLogo />
            <ButtonContainer>
                {!currentUser ? (
                    <PolygonButton
                        onClick={() =>
                            Moralis.authenticate().then((user) =>
                                setCurrentUser(user)
                            )
                        }
                        variant="contained"
                    >
                        Login
                    </PolygonButton>
                ) : (
                    <PolygonButton
                        onClick={() =>
                            Moralis.User.logOut().then(() => {
                                setCurrentUser(Moralis.User.current()); // this will now be null
                            })
                        }
                        variant="contained"
                    >
                        Logout
                    </PolygonButton>
                )}
            </ButtonContainer>
        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.header`
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    border-bottom: 1px solid #8247e5;
    height: 100px;
`;

const MaticLogo = styled(Logo)`
    place-self: center;
    grid-column: 3 / span 2;
    width: 50px;
`;

const ButtonContainer = styled.div`
    grid-column: 20 / span 2;
    place-self: center;
`;
