import React, {VFC} from "react";

import {IconButton, ListItem, ListItemButton, ListItemText, ListSubheader, MenuItem} from "@mui/material";
import {useMatch, useNavigate, useParams, useResolvedPath} from "react-router-dom";
import DeleteForever from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
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
    console.log(serverId, item.id, "QRQRQRRQ")
    // eslint-disable-next-line eqeqeq
    // @ts-ignore
    const isSelected = serverId == item.id
    return <ListItem className={styles.sidebar} disableGutters disablePadding secondaryAction={
        <>
            <IconButton edge="end" aria-label="delete">
                <ModeEditIcon/>
            </IconButton>
            <IconButton edge="end" aria-label="delete">
                <DeleteForever/>
            </IconButton>
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