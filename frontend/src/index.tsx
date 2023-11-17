import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";
import {configure} from "mobx";
import RootStore from "./stores/RootStore";
import {StoreProvider} from "./stores";

import App from "./App";
import RabbitServerView from "./views/RabbitServerView/RabbitServerView";
import MainPage from "./views/MainPage";
import QueueDetailView from "./views/QueueDetailView/QueueDetailView";

configure({isolateGlobalState: true})
const mobxStore = new RootStore()

ReactDOM.render(
    <StoreProvider store={mobxStore}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<MainPage/>}/>
                    <Route path="server/:serverId" element={<RabbitServerView/>}/>
                    <Route path="server/:serverId/queue/:uuid" element={<QueueDetailView/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    </StoreProvider>,
    document.getElementById("root")
);
