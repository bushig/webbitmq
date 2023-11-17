import React, { FC } from "react";
import {observer} from "mobx-react";
import Message from "../Message/Message";
import {MessageType} from "../../models/queues";

type MessageListProps = {
  messages: MessageType[];
  handleOpenSnackbar: ()=> void
};
// TODO: finish component
const MessageList: FC<MessageListProps> = ({ messages, handleOpenSnackbar }) => (
  <>
    {messages.map((message) => <Message key={Math.random()} message={message} handleOpenSnackbar={handleOpenSnackbar}/>)}
  </>
);

export default observer(MessageList);
