// @ts-nocheck
import React, {FC, useEffect, VFC} from "react";

import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {Alert, Button, Checkbox, Chip, Fab, Link, Paper, Snackbar, Tooltip} from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AirIcon from '@mui/icons-material/Air';
import MessageList from "../../components/MessageList/MessageList";
import styles from "./QueueDetailView.module.scss";
import {useStores} from "../../hooks";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import AddQueueForm from "../../components/AddQueueForm/RabbitForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import notifictionsound from "../../assets/sounds/notification.mp3";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

var audio = new Audio(notifictionsound);
const MessagesCount: VFC = observer((props) => {
    const {
        queueStore: {
            messagesCount,
        }
    } = useStores()
    return <span id="messagesCount">{messagesCount}</span>
})


const QueueDetailView: FC = (props) => {
    const {uuid} = useParams();

    const {
        queueStore: {
            fetchQueueMeta,
            activeQueueInfo,
            messagesCount,
            fetchMessagesList,
            addMessage,
            bindingsForCopy,
        }
    } = useStores()

    const [open, setOpen] = React.useState(false);
    const [snackHeaderName, setSnackHeaderName] = React.useState("");
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
    // const [bindingsForCopy, setBindingsForCopy] = React.useState<boolean>(null)
    // alert(JSON.stringify(bindingsForCopy))
    const wsInit = () => {
        const ws = new WebSocket(`ws://${window.location.host}/ws/${uuid}`);
        ws.onmessage = event => {
            console.log("event", event);
            const data = JSON.parse(event.data);
            const messageCountFromElem = parseInt(document.getElementById("messagesCount").textContent) + 1
            const notif = new Notification("Новый ивент webbit", {
                body: `${data.exchange}->${data.routing_key} ${messageCountFromElem}`,
                // tag: `${data.exchange}->${data.routing_key}`,
            });
            addMessage(data);
            audio.play().catch(() => {
                console.log("unable to play sound")
            });

        };
        return ws;
    };

    useEffect(() => {
        Notification.requestPermission().then(function (permission) {
            console.log(permission)
        });
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

    const handleOpenSnackbar = (text) => {
        setSnackHeaderName(text);
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    }


    const handleOpenQueueCreation = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // Подставляем данные текущей очереди в поля
        setIsModalOpen(true)
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
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Button style={{margin: 10}} variant="contained" color="secondary" size={"small"}
                                startIcon={<AddCircleIcon/>} onClick={handleOpenQueueCreation}>Создать копию
                            очереди</Button>
                        <Checkbox label="Скроллить к новым сообщениям" color={"warning"}/>
                    </div>
                    <div className={styles.queueBindingInfo}>
                        <b>Биндинги:</b>
                        <div className={styles.queueBindingDetail}>
                            {activeQueueInfo.bindings.map((binding) => (
                                <div key={`${binding.exchange_name}${binding.routing_key}`} style={{"display": "flex"}}>
                                    <div><Tooltip title="exchange"><Chip color={"warning"} size="small"
                                                                         icon={<AirIcon/>}
                                                                         label={binding.exchange_name}/></Tooltip></div>

                                    <div><Tooltip title="routing key"><Chip color={"warning"} size="small"
                                                                            icon={<VpnKeyIcon/>}
                                                                            label={binding.routing_key}/></Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div><b>Количество сообщений:</b> <MessagesCount/></div>
                        <span style={{color: "#d9d8d4", textDecoration: "underline"}}>Новые сообщения появляются внизу</span>
                    </div>
                    <div>

                        <CountdownTimer
                            dateEnd={dateEnd}
                        />

                    </div>
                </div>
            </div>
            {/*<Alert severity="error">This is an error alert — check it out!</Alert>*/}
            {isModalOpen && <AddQueueForm bindings={bindingsForCopy} handleClose={() => {
                setIsModalOpen(false)
            }}/>}
            <Snackbar
                open={open}
                autoHideDuration={700}
                onClose={handleClose}
            ><Alert
    onClose={handleClose}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    {`Значение хедера "${snackHeaderName}" скопировано`}
  </Alert></Snackbar>
            <div className={styles.list_wrapper}>
                <div className={styles.list_header_wrapper}>
                    <div className={styles.list_header_column_wrapper} style={{width: "30%"}}><b>Время чтения из
                        очереди:</b>
                    </div>
                    <div className={styles.list_header_column_wrapper} style={{width: "30%"}}><b>Источник:</b></div>
                    <div className={styles.list_header_column_wrapper} style={{width: "30%"}}><b>Параметры:</b></div>
                    <div className={styles.list_header_column_wrapper} style={{width: "100%"}}><b>Хедеры:</b></div>
                </div>

                <MessageList handleOpenSnackbar={handleOpenSnackbar}/>
            </div>
        </Paper>
    );
};

export default observer(QueueDetailView)
