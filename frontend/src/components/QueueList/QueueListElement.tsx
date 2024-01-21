import React, {VFC} from "react";

import {Divider, ListItem, ListItemText, Tooltip} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {QueueInfoType} from "../../models/queues";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import {format, formatDistance} from 'date-fns'
import {ru} from 'date-fns/locale'

import styles from "./QueueListElement.module.scss";

interface IQueueListElementProps {
    item: QueueInfoType
}

const QueueListElement: VFC<IQueueListElementProps> = ({item}) => {
    const to = `/server/${item.rabbit_server_id}/queue/${item.uuid}`
    const navigate = useNavigate()
    const dateEnd = new Date(item.expires_at)
    const creationDateText = formatDistance(item.starts_at, new Date(), { addSuffix: true, locale: ru })
    const creationDate = format(item.starts_at, 'dd.MM.yyyy HH:mm:ss')
    return <>
        <Divider/>
        <ListItem
            onClick={
                () => {
                    navigate(to)
                }
            }
            button
            // component={Link}
            // to={to}
        >
            <ListItemText
                primary={<div><span>{item.bindings.map((binding) => <div>
                    <span>exchange: <b>{binding.exchange_name}</b></span><br/>
                    <span>routing_key: <b>{binding.routing_key}</b></span>
                </div>)}</span></div>}
                secondary={
                    <>

                        <CountdownTimer dateEnd={dateEnd} compact/>
                        Дата создания: <Tooltip arrow
    placement = "bottom-start"
                                                title = {creationDate}><span className={styles.creationDate}>{creationDateText}</span></Tooltip>
                    </>
                }
            />
        </ListItem>
    </>
};


export default QueueListElement;