import React, { FC, useMemo, useState } from "react";
import ReactJson from "react-json-view";

import style from "./Message.module.scss";
import {MessageType} from "../../models/queues";

const JsonToObject = (json: string) => JSON.parse(json);

type IMessageProps = {
  message: MessageType;
}

// TODO: finish component
const Message: FC<IMessageProps> = ({message}) => {
  const realData = message;
  console.log(realData, "realData");
  console.log(realData.payload, "realData.payload");
  const [expanded, setExpanded] = useState<boolean>(false);

  const switchView = async () => {
    setExpanded(!expanded);
  };

  const renderedData = useMemo(() => JsonToObject(realData.payload), [realData.payload]);
  return (
    <div className={style.wrapper_wrapper}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={switchView} className={style.message_wrapper}>
        <div className={style.date}> {realData.timestamp}</div>
        {!expanded && <div>{realData.payload}</div>}
      </div>
      {expanded && <ReactJson src={renderedData} theme="monokai" />}
    </div>
  );
};
export default Message;
