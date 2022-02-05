import React from "react";
import Moralis from "moralis";
import styled from "styled-components";
import { PolygonButton } from "./Components.sc";
import { ReactComponent as Logo } from "../assets/polygon-matic-logo.svg";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { handleUser } from "../redux/features/userSlice";

const Header: React.FC = () => {
    const user = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(handleUser(Moralis.User.current()));
    }, [dispatch]);

    Moralis.onAccountChanged(() => {
        Moralis.User.logOut().then(() =>
            dispatch(handleUser(Moralis.User.current()))
        );
    });

    return (
        <HeaderContainer>
            <MaticLogo />
            <ButtonContainer>
                {!user ? (
                    <PolygonButton
                        onClick={() => {
                            Moralis.authenticate().then((user) => {
                                dispatch(handleUser(user));
                            });
                        }}
                        variant="contained"
                    >
                        Login
                    </PolygonButton>
                ) : (
                    <PolygonButton
                        onClick={() => {
                            Moralis.User.logOut().then(() =>
                                dispatch(handleUser(Moralis.User.current()))
                            );
                        }}
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
