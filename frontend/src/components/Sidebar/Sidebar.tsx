import React, {ReactElement, VFC} from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import {Drawer} from "@mui/material";
import Logo from "../Logo/Logo";


const drawerWidth = 240;
interface ISidebarProps {
    // isCollapsed: boolean
    // onCollapse: () => void
    children: ReactElement
}

const Sidebar: VFC<ISidebarProps> = ({children}) =>
    <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
    {/*<div className={styles.sidebar}>*/}
        <Logo/>
        <Divider/>
        <List>{children}</List>
        <Divider/>
        {/*something*/}
    {/*</div>*/}
    </Drawer>
;


export default Sidebar;