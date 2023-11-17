import React, {VFC} from "react";

import {Button, ListItem, Link, ListItemText, Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {QueueInfoType} from "../../models/queues";
import CountdownTimer from "../CountdownTimer/CountdownTimer";


interface IQueueListElementProps {
    item: QueueInfoType
}

const QueueListElement: VFC<IQueueListElementProps> = ({item}) => {
    const to = `/server/${item.rabbit_server_id}/queue/${item.uuid}`
    const navigate = useNavigate()
    const dateEnd = new Date(item.expires_at)
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
                        Дата создания: {item.starts_at}
                    </>
                }
            />
        </ListItem>
    </>
};


export default QueueListElement;