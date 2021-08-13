import React, {VFC} from "react";

import styles from "./ServerList.module.scss";
import ServerListElement from "./ServerListElement";
import {ServerInfo} from "../../models/servers";



interface IServerListProps {
    // isCollapsed: boolean
    // onCollapse: () => void
    servers: ServerInfo[]
}

const ServerList: VFC<IServerListProps> = ({servers}) =>
    <div className={styles.sidebar}>
        {servers.map((server) => <ServerListElement key={server.id} item={server}/>)}
    </div>
;


export default ServerList;