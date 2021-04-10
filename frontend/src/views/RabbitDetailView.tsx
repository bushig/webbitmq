import React, { FC, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getMessagesList, getQueueMeta, MessageData } from "../utils/api";
import MessageList from "../components/MessageList";
// import Timer from 'ati-ui-react/components/Timer';
import styles from "../css/RabbitDetailView.module.css";
import { RABBIT_EXCHANGE_POSTFIX, RABBIT_QUEUE_POSTFIX } from "../config";

export const RabbitDetailView: FC = (props) => {
  console.log(props);
  let { id } = useParams<{ id: string }>();

  const [ttl, setTtl] = useState<number>(0);
  const [routingKey, setRoutingKey] = useState<string>("");
  const [exchangeName, setExchangeName] = useState<string>("");
  const [rabbitHost, setRabbitHost] = useState<string>("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const wsInit = () => {
    const ws = new WebSocket(`ws://${window.location.host}/ws/${id}`);
    ws.onmessage = function(event) {
      console.log("event", event);
      const data = JSON.parse(event.data);
      const notif = new Notification("Новый ивент", {
        body: "Новое сообщение в очереди"
      });
      setMessages((prevData) => {
        return [...prevData, data];
      });
    };
    return ws;
  };

  useEffect(() => {
    // Notification.requestPermission(function (permission) {
    //   // переменная permission содержит результат запроса
    //   console.log('Результат запроса прав:', permission);
    // });
    getQueueMeta(id).then((metaInfo) => {
      console.log("metaInfo", metaInfo);
      setTtl(metaInfo.ttl);
      setRoutingKey(metaInfo.routing_key);
      setExchangeName(metaInfo.exchange_name);
      setRabbitHost(metaInfo.rabbit_host);
      setToDate(metaInfo.to);
      setFromDate(metaInfo.from);
    });
    getMessagesList(id).then((messagesList: MessageData[]) => {
      console.log("metaInfo", messagesList);
      setMessages(messagesList);
    });
    wsInit();
  }, []);

  let endDate = null;
  if (toDate) {
    endDate = new Date(toDate);
  }
  console.log(endDate, "endDate");

  return (
    <div style={{ width: "100%" }}>
      <div className={styles.queueInfo}>
        <div className={styles.queue}>
          Queue:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${rabbitHost}${RABBIT_QUEUE_POSTFIX}${id}`}
          >
            {id}
          </a>
        </div>
        <br />
        <div className={styles.mainQueueInfo}>
          <div>
            Exchange:{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${rabbitHost}${RABBIT_EXCHANGE_POSTFIX}${exchangeName}`}
            >
              {exchangeName}
            </a>
          </div>
          <div>
            Host:{" "}
            <a target="_blank" rel="noopener noreferrer" href={rabbitHost}>
              {rabbitHost}
            </a>
          </div>
          <div>Routing key: {routingKey}</div>
          <div>Количество сообщений: {messages.length}</div>
          <div>
            {/*{endDate && (*/}
            {/*    <div className={styles.timer}>*/}
            {/*        <Timer*/}
            {/*            expirationDate={endDate}*/}
            {/*            hintText=""*/}
            {/*            expiredText="ПОТРАЧЕНО"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
      <div className={styles.list_wrapper}>
        <MessageList messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};
