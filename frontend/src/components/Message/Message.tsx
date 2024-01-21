import React, {FC, useState} from "react";
import ReactJson from "react-json-view";

import style from "./Message.module.scss";
import {MessageType} from "../../models/queues";
import {Alert, Tooltip} from "@mui/material";
import {format} from "date-fns";
import {observer} from "mobx-react";

const stringToColour = (str: string) => {
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += value.toString(16).padStart(2, '0')
    }
    return colour
}
const JsonToObject = (json: string) => JSON.parse(json);

type IMessageProps = {
    message: MessageType;
    handleOpenSnackbar: (text: string) => void;
    onViewHandler: () => void;
    position: number;
}

const Message: FC<IMessageProps> = ({message, handleOpenSnackbar, onViewHandler}) => {
    const realData = message;
    const [expanded, setExpanded] = useState<boolean>(false);
    const isHighlighted = message.isHighlighted
    const switchView = async () => {
        setExpanded(!expanded);
    };
    const messageDateText = format(realData.timestamp, 'dd.MM.yyyy HH:mm:ss:SSS')
    let messageParsed = null
    let isParsingError = false
    if (expanded) {
        try {
            messageParsed = JsonToObject(realData.payload)
        } catch {
            isParsingError = true
        }
    }

    // const renderedData = useMemo(() => JsonToObject(realData.payload), [realData.payload]);
    return (
        <div className={`${style.wrapper_wrapper} ${isHighlighted && style.highlighted}`}
             onMouseOver={() => {
                 onViewHandler()
             }
             }>
            <div onClick={switchView} className={style.message_wrapper}>
                <div className={style.date}> {messageDateText}</div>
                <div className={style.routing_key}>
                    <div><span className={style.dot}
                               style={{"backgroundColor": stringToColour(`${realData.exchange}${realData.routing_key}`)}}></span>
                        <span>exchange={realData.exchange}</span></div>
                    <div>routing_key={realData.routing_key}</div>
                </div>
                <div className={style.app_id}>app_id={realData.app_id}</div>
                <div className={style.headers}>{Object.keys(realData.headers).map((header_key, key) => {
                        const headerValue = JSON.stringify(realData.headers[header_key])
                        return <Tooltip arrow
                                        placement="bottom-start"
                                        title={headerValue} key={header_key}>
                            <div className={style.header_copy_link} onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(headerValue)
                                handleOpenSnackbar(header_key)
                            }}>
                                <b>{`${key + 1}.`} {header_key}</b>=<abbr>{headerValue}</abbr>
                            </div>
                        </Tooltip>;
                    }
                )}</div>
                {/*{!expanded && <div>{realData.payload}</div>}*/}
            </div>
            {expanded && isParsingError && <Alert severity="warning">
                Ошибка парсинга JSON!
                <br/>{realData.payload}
            </Alert>}
            {expanded && !isParsingError && <ReactJson src={messageParsed} theme="monokai"/>}
        </div>
    );
};
export default observer(Message);
