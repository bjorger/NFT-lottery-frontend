import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
        border: Palette["text"];
    }
    interface PaletteOptions {
        border?: PaletteOptions["text"];
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#8247e5",
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 1200,
            lg: 1400,
            xl: 1536,
        },
    },
});

export default theme;
