import React, { ReactElement, VFC } from "react";

import styles from "./Sidebar.module.scss";
import Logo from "../Logo/Logo";

interface ISidebarProps {
  // isCollapsed: boolean
  // onCollapse: () => void
  children: ReactElement
}

const Sidebar: VFC<ISidebarProps> = ({ children }) =>
  <div className={styles.sidebar}>
    <Logo />
    {children}
  </div>
;


export default Sidebar;