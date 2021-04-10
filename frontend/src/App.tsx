import React, { VFC } from "react";
import { Route, Switch } from "react-router-dom";
import styles from "./App.module.scss";

import MainPage from "./views/MainPage";
import Sidebar from "./components/Sidebar/Sidebar";


const App: VFC = () => (
  <div className={styles.wrapper}>
    <Sidebar>
      <>
        Это сайдбар
      </>
    </Sidebar>
    <div className={styles.content}>
      <Switch>
        <Route exact path="/" component={MainPage} />
      </Switch>
    </div>
  </div>);

export default App;
