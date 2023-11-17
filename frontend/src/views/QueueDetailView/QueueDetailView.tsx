import React, {FC, useEffect, useState} from "react";

import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {Alert, Chip, Link, Paper, Snackbar, Tooltip} from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AirIcon from '@mui/icons-material/Air';
import MessageList from "../../components/MessageList/MessageList";
import styles from "./QueueDetailView.module.scss";
import {useStores} from "../../hooks";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";

const QueueDetailView: FC = (props) => {
    const {uuid} = useParams();

    const {
        queueStore: {
            fetchQueueMeta,
            activeQueueInfo,
            messages,
            fetchMessagesList,
            addMessage
        }
    } = useStores()

    const [open, setOpen] = React.useState(false);

    const wsInit = () => {
        const ws = new WebSocket(`ws://${window.location.host}/ws/${uuid}`);
        ws.onmessage = function (event) {
            console.log("event", event);
            const data = JSON.parse(event.data);
            const notif = new Notification("Новый ивент", {
                body: "Новое сообщение в очереди"
            });
            addMessage(data);
        };
        return ws;
    };

    useEffect(() => {
        fetchQueueMeta(uuid).then(() => {
                fetchMessagesList()
                wsInit();
            }
        )

    }, []);

    if (activeQueueInfo === null) {
        return <div>Loading</div>
    }

    const dateEnd = new Date(activeQueueInfo.expires_at);

    const handleOpenSnackbar = () => {
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

    return (
        <Paper elevation={2}>
            <div className={styles.queue_header_wrapper}>
                <div className={styles.queue}>
                    <b>Очередь:{" "}</b>
                    <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${activeQueueInfo.base_rabbit_admin_url}/queues/%2F/${activeQueueInfo.queue_name}`}
                    >
                        {activeQueueInfo.queue_name}
                    </Link>
                </div>
                <br/>
                <div className={styles.mainQueueInfo}>
                    <div>
                        <b>Host:{" "}</b>
                        <a target="_blank" rel="noopener noreferrer"
                           href="test"
                        >
                            {/*{rabbitHost}*/}
                        </a>
                    </div>
                    <div className={styles.queueBindingInfo}>
                        <b>Bindings:</b>
                        <div className={styles.queueBindingDetail}>
                            {activeQueueInfo.bindings.map((binding) => (
                                <div style={{"display": "flex"}}>
                                    <div> <Tooltip title="exchange"><Chip size="small" icon={<AirIcon/>} label={binding.exchange_name}  /></Tooltip> </div>
                                    --
                                    <div> <Tooltip title="routing key"><Chip size="small" icon={<VpnKeyIcon/>} label={binding.routing_key}  /></Tooltip> </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div><b>Количество сообщений:</b> {messages.length}</div>
                    <div>

                        <CountdownTimer
                            dateEnd={dateEnd}
                        />

                    </div>
            </div>
                </div>
            {/*<Alert severity="error">This is an error alert — check it out!</Alert>*/}
            <Snackbar
                    open={open}
                    autoHideDuration={700}
                    message="Значение хедера скопировано"
                    onClose={handleClose}
                />
            <div className={styles.list_wrapper}>

                <MessageList messages={messages} handleOpenSnackbar={handleOpenSnackbar}/>
            </div>
        </Paper>
    );
};

export default observer(QueueDetailView)
