import React, {FC, useMemo, useState} from "react";
import ReactJson from "react-json-view";

import style from "./Message.module.scss";
import {MessageType} from "../../models/queues";
import {Chip, Tooltip} from "@mui/material";

const JsonToObject = (json: string) => JSON.parse(json);

type IMessageProps = {
    message: MessageType;
    handleOpenSnackbar: () => void;
}

// TODO: finish component
const Message: FC<IMessageProps> = ({message, handleOpenSnackbar}) => {
    const realData = message;
    const [expanded, setExpanded] = useState<boolean>(false);

    const switchView = async () => {
        setExpanded(!expanded);
    };

    const renderedData = useMemo(() => JsonToObject(realData.payload), [realData.payload]);
    return (
        <div className={style.wrapper_wrapper}>
            <div onClick={switchView} className={style.message_wrapper}>
                <div className={style.date}> {realData.timestamp}</div>
                <div className={style.routing_key}>
                    <div>exchange={realData.exchange}</div>
                    <div>routing_key={realData.routing_key}</div>
                </div>
                <div className={style.app_id}>app_id={realData.app_id}</div>
                <div className={style.headers}>{Object.keys(realData.headers).map((header_key) => <Tooltip arrow
                                                                                                           placement="bottom-start"
                                                                                                           title={`${realData.headers[header_key]}`}>
                        <div onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(realData.headers[header_key])
                            handleOpenSnackbar()
                        }}>
                            HEADER {header_key}: <abbr>{realData.headers[header_key]}</abbr>
                        </div>
                    </Tooltip>
                )}</div>
                {!expanded && <div>{realData.payload}</div>}
            </div>
            {expanded && <ReactJson src={renderedData} theme="monokai"/>}
        </div>
    );
};
export default Message;
