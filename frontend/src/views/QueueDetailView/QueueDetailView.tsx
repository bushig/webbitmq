import React, {FC, useEffect, useState} from "react";

import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {Paper} from "@mui/material";
import MessageList from "../../components/MessageList/MessageList";
import styles from "./QueueDetailView.module.scss";
import {useStores} from "../../hooks";

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
        // Notification.requestPermission(function (permission) {
        //   // переменная permission содержит результат запроса
        //   console.log('Результат запроса прав:', permission);
        // });
        fetchQueueMeta(uuid).then(() => {
                fetchMessagesList()
                wsInit();
            }
        )

    }, []);

    if (activeQueueInfo === null) {
        return <div>Loading</div>
    }

    const endDate = new Date(activeQueueInfo.expires_at);

    console.log(endDate, "endDate");

    return (
        <Paper elevation={2}>
            <div>
                <div className={styles.queue}>
                    Queue:{" "}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${uuid}`}
                    >
                        {uuid}
                    </a>
                </div>
                <br/>
                <div className={styles.mainQueueInfo}>
                    <div>
                        Exchange:{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${activeQueueInfo.exchangeName}`}
                        >
                            {activeQueueInfo.exchange_name}
                        </a>
                    </div>
                    <div>
                        Host:{" "}
                        <a target="_blank" rel="noopener noreferrer"
                           href="test"
                        >
                            {/*{rabbitHost}*/}
                        </a>
                    </div>
                    <div>Routing key: {activeQueueInfo.routing_key}</div>
                    <div>Количество сообщений: {messages.length}</div>
                    <div>

                        <div className={styles.timer}>
                            TIMER HERE
                            {/*<Timer*/}
                            {/*    expirationDate={endDate}*/}
                            {/*    hintText=""*/}
                            {/*    expiredText="ПОТРАЧЕНО"*/}
                            {/*/>*/}
                        </div>

                    </div>
                </div>
            </div>
            <div className={styles.list_wrapper}>
                <MessageList messages={messages}/>
            </div>
        </Paper>
    );
};

export default observer(QueueDetailView)
