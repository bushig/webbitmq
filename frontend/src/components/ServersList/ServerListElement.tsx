import React, {VFC} from "react";

import {Icon} from "@blueprintjs/core";
import styles from "./ServerListElement.module.scss";
import {ServerInfo} from "../../models/servers";


interface IServerListElementProps {
    // isCollapsed: boolean
    // onCollapse: () => void
    item: ServerInfo
}

const ServerListElement: VFC<IServerListElementProps> = ({item}) =>
    <div className={styles.sidebar}>
        {item.name} <Icon icon="edit"/> <Icon icon="trash"/>
    </div>
;


export default ServerListElement;