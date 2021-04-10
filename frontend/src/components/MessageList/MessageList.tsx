import React, { FC } from "react";
import Message from "../Message/Message";

type MessageData = {};

type MessageListProps = {
  messages: MessageData[];
  setMessages: any;
};
// TODO: finish component
const MessageList: FC<MessageListProps> = ({ messages }) => (
  <>
    {messages.map((message, index) => <Message key={index} data={message} />)}
  </>
);

export default MessageList;
