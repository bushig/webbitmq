import React, {VFC} from "react";

import {ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useNavigate, useParams, useResolvedPath} from "react-router-dom";
import styles from "./ServerListElement.module.scss";
import {ServerInfoType} from "../../models/servers";


interface IServerListElementProps {
    // isCollapsed: boolean
    // onCollapse: () => void
    item: ServerInfoType
}

const ServerListElement: VFC<IServerListElementProps> = ({item}) => {
    const to = `/server/${item.id}`
    const resolved = useResolvedPath(to);
    // const match = useMatch({ path: resolved.pathname, end: true });
    const { serverId } = useParams();
    const navigate = useNavigate()
    // eslint-disable-next-line eqeqeq
    // @ts-ignore
    const isSelected = serverId == item.id
    return <ListItem className={styles.sidebar} disableGutters disablePadding secondaryAction={
        <>
            {/* TODO: Вернуть иконки удаления */}
            {/*<IconButton edge="end" aria-label="delete">*/}
            {/*    <ModeEditIcon/>*/}
            {/*</IconButton>*/}
            {/*<IconButton edge="end" aria-label="delete">*/}
            {/*    <DeleteForever/>*/}
            {/*</IconButton>*/}
        </>
    }>
        <ListItemButton selected={isSelected} onClick={() => {
                navigate(to)
            }}>
            <ListItemText secondary={`amqp://${item.username}:***@${item.host}:${item.port}${item.vhost}`}
            > {item.name}</ListItemText>
        </ListItemButton>

    </ListItem>
};


export default ServerListElement;