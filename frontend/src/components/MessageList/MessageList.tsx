import React, { FC } from "react";
import Message from "../Message/Message";

type MessageData = {};

type MessageListProps = {
  messages: MessageData[];
  setMessages: any;
};
// TODO: finish component
const MessageList: FC<MessageListProps> = ({ messages }) => {
  return (
    <>
      {messages.map((message, index) => {
        return <Message key={index} data={message} />;
      })}
    </>
  );
};

export default MessageList;
