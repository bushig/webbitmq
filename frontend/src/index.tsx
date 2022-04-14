import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import "./index.css";
import {configure} from "mobx";
import RootStore from "./stores/RootStore";
import { StoreProvider } from "./stores";

import App from "./App";

configure({isolateGlobalState: true})
const mobxStore = new RootStore()

ReactDOM.render(
    <StoreProvider store={mobxStore}>
        <Router>
            <App/>
        </Router>
    </StoreProvider>,
    document.getElementById("root")
);
