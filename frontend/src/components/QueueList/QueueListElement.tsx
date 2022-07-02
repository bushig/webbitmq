import React, {VFC} from "react";

import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {QueueInfoType} from "../../models/queues";


interface IQueueListElementProps {
    item: QueueInfoType
}

const QueueListElement: VFC<IQueueListElementProps> = ({item}) => {
    const to = `/queue/${item.uuid}`
    const navigate = useNavigate()
    return <div>
        Uuid: {item.uuid}
        <Button
            onClick={() => {
                navigate(to)
            }}
        >
            Открыть
        </Button>
    </div>
};


export default QueueListElement;