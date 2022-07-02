import React, { FC } from "react";
import {observer} from "mobx-react";
import Message from "../Message/Message";
import {MessageType} from "../../models/queues";

type MessageListProps = {
  messages: MessageType[];
};
// TODO: finish component
const MessageList: FC<MessageListProps> = ({ messages }) => (
  <>
    {messages.map((message) => <Message key={Math.random()} message={message} />)}
  </>
);

export default observer(MessageList);
