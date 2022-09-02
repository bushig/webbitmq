import React, {VFC} from "react";

import {Button, ListItem, Link, ListItemText} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {QueueInfoType} from "../../models/queues";


interface IQueueListElementProps {
    item: QueueInfoType
}

const QueueListElement: VFC<IQueueListElementProps> = ({item}) => {
    const to = `/queue/${item.uuid}`
    const navigate = useNavigate()
    return <ListItem
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
            primary={`UUID: ${item.uuid}`}
            secondary={
                <>
                    some info
                </>
            }
        />
    </ListItem>
};


export default QueueListElement;