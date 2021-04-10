import React, { FC, useMemo, useState } from "react";
import ReactJson from "react-json-view";

import style from "./Message.module.scss";

const JsonToObject = (json: string) => JSON.parse(json);

// TODO: finish component
const Message: FC<any> = (props) => {
  console.log(props, "props");
  const { index, data } = props;
  const realData = data;
  console.log(realData, "realData");
  console.log(realData.payload, "realData.payload");
  const [expanded, setExpanded] = useState<boolean>(false);

  const switchView = async () => {
    setExpanded(!expanded);
  };

  const renderedData = useMemo(() => JsonToObject(realData.payload), [realData.payload]);
  return (
    <div className={style.wrapper_wrapper}>
      <div onClick={switchView} className={style.message_wrapper}>
        <div className={style.date}> {realData.timestamp}</div>
        {!expanded && <div>{realData.payload}</div>}
      </div>
      {expanded && <ReactJson src={renderedData} theme="monokai" />}
    </div>
  );
};
export default Message;
