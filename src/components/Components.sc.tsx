import styled from "styled-components";
import { Button } from "@mui/material";

export const PolygonButton = styled(Button)`
    background: ${({ theme }) => theme.palette.primary.main} !important;
    width: 200px;
`;
