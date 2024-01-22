import React, {FC, useEffect, useRef} from "react";
import {observer} from "mobx-react";
import Message from "../Message/Message";
import {useStores} from "../../hooks";
import {Checkbox, Fab, Tooltip} from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import styles from "./MessageList.module.scss"

type MessageListProps = {
  // messages: MessageType[];
  handleOpenSnackbar: (text: string)=> void
};
// TODO: finish component
const MessageList: FC<MessageListProps> = ({handleOpenSnackbar }) => {
  const {
        queueStore: {
            messages,
            setHighlightedFalse,
            isAutoFollowingNewMessages,
            toggleIsAutoFollowingNewMessages,
            messagesCount
        }
    } = useStores()
    const refDown = useRef<HTMLDivElement>(null);
    const refTop = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        refDown.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    const scrollToTop = () => {
        refTop.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  useEffect(() => {
      console.log("USE EFFECT", messages.length, isAutoFollowingNewMessages)
    if (messages.length && isAutoFollowingNewMessages) {
        scrollToBottom()
    }
  }, [messagesCount, isAutoFollowingNewMessages]);

  return (
      <>
          <div ref={refTop}></div>
          {messages.map((message, position) => <Message key={position} onViewHandler={() => {
              if (message.isHighlighted) {
                  setHighlightedFalse(position)
              }
          }} position={position} message={message}
                                                        handleOpenSnackbar={handleOpenSnackbar}/>)}
          <div ref={refDown}></div>
          <div className={styles.scroll_buttons_wrapper}>
              <Fab variant="extended" onClick={scrollToTop}>
                  <ArrowUpwardIcon/>
              </Fab>
              <div className={styles.auto_follow_wrapper} >
                  {/*<FollowTheSignsIcon fontSize={"small"} />*/}
                  <Tooltip arrow
                                        placement="left-start"
                                        title={"Включение автоматического следования за новыми сообщениями"}>
                  <Checkbox value={isAutoFollowingNewMessages} onClick={toggleIsAutoFollowingNewMessages} />
                  </Tooltip>
              </div>
              <Fab variant="extended" onClick={scrollToBottom}>
                  <ArrowDownwardIcon/>
              </Fab>
          </div>
      </>
  );
};

export default observer(MessageList);
