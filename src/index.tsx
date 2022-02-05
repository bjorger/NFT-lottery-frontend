import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Moralis from "moralis";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import { Provider } from "react-redux";
import { store } from "./redux/store";
const serverUrl = "https://bf3dqqia5hxt.usemoralis.com:2053/server";
const appId = "e3xNUeISKbSEBCNhAMnSLMpBPTuSPFyos2b1ZLa5";

Moralis.start({ serverUrl, appId });
Moralis.enableWeb3({ provider: "metamask" });

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
