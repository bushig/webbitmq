import React, {useState, VFC} from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {Button, List} from "@mui/material";
import QueueListElement from "./QueueListElement";
import {QueueInfoType} from "../../models/queues";
import AddQueueForm from "../AddQueueForm/RabbitForm";


interface IServerListProps {
    queues: QueueInfoType[]
}

const QueueList: VFC<IServerListProps> = ({queues}) => {
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

        return <div>
            <Button variant="contained" color="secondary" startIcon={<AddCircleIcon/>} onClick={() => {
                setIsModalOpen(true)
            }}>
                Add queue
            </Button>
            {isModalOpen && <AddQueueForm handleClose={() => {
                setIsModalOpen(false)
            }}/>}
            <List>
                {queues.map((queue) => <QueueListElement key={queue.uuid} item={queue}/>)}
            </List>
        </div>;
    }
;


export default QueueList;