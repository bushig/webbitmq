import React, {useEffect, VFC} from "react";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useStores} from "../../hooks";
import QueueList from "../../components/QueueList/QueueList";

const RabbitServerView: VFC = () => {
    const params = useParams();
    const {serverStore, queuesStore, queuesStore: {totalQueuesCount}} = useStores()

    useEffect(() => {
        serverStore.fetchServerMeta(Number(params.serverId))
    }, [params.serverId])


    useEffect(() => {
        queuesStore.fetchQueuesList(Number(params.serverId))
    }, [params.serverId])


    return (
        <div>
            <div style={{paddingLeft: 10}}>
                На этой странице только последние 250 очередей.<br/>
                Общее количество: {totalQueuesCount}</div>
            <QueueList queues={queuesStore.queues}/>
        </div>
    )
};

export default observer(RabbitServerView)