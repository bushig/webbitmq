import React, { VFC } from "react";
import { Route, Switch } from "react-router-dom";
import styles from "./App.module.scss";

import MainPage from "./views/MainPage";
import Sidebar from "./components/Sidebar/Sidebar";
import ServerList from "./components/ServersList/ServerList";


const servers = [
    {id: 1, name: "Tesr"},
]

const App: VFC = () => (
  <div className={styles.wrapper}>
    <Sidebar>
        <ServerList servers={servers}/>
    </Sidebar>
    <div className={styles.content}>
      <Switch>
        <Route exact path="/" component={MainPage} />
      </Switch>
    </div>
  </div>);

export default App;
