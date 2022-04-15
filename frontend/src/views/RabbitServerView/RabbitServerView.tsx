import React, {useEffect, VFC} from "react";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import {useStores} from "../../hooks";

const RabbitServerView: VFC = () => {
    const params = useParams();
    const {serverStore} = useStores()

    useEffect(() => {
        serverStore.fetchServerMeta(Number(params.serverId))
    }, [params.serverId])


    return (<div>
        Detail server page


        serverStore: {serverStore.activeServerId}
    </div>)
};

export default observer(RabbitServerView)