import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Lottery from "./components/Lottery";
import Header from "./components/Header";
function App() {
    return (
        <div className="App">
            <Header />
            <Lottery />
        </div>
    );
}

export default App;
