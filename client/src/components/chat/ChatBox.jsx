import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { ChatContext } from "../../contexts/ChatContext"
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"
import { Stack } from "react-bootstrap"
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import { useRef } from "react"
import { useEffect } from "react"

const ChatBox = () => {
    const {user} = useContext(AuthContext)
    const {currentChat, messages, isMessagesLoading, messagesError, sendTextMessage} = useContext(ChatContext)
    const {recipientUser} = useFetchRecipientUser(currentChat, user)
    const [textMessage, setTextMessage] = useState("")
    const scroll = useRef()

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior:"smooth"})
    }, [messages])
    

  return (
    <>
    {!recipientUser && <p style={{textAlign:'center', width:'100%'}}>No conversation selected</p>}
    {isMessagesLoading && <p style={{textAlign:'center', width:'100%'}}>Loading messages</p>}

    {recipientUser && <Stack className="chat-box" gap={4}>
        <div className="chat-header">
            <strong>{recipientUser?.name}</strong>
        </div>
        <Stack className="messages" gap={3}>
            {messages && messages.map((message, index)=>{
                return(
                    <Stack className={`${message?.senderId === user._id ? "message self align-self-end flex-grow-0": "message align-self-start flex-grow-0"}`} key={index} ref={scroll}>
                        <span>{message.text}</span>
                        <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                    </Stack>
                )
            })}
        </Stack>
        <Stack className="chat-input flex-grow-0" direction="horizontal" gap={3}> 
            <InputEmoji value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgb(72,112,223,0.2)"/>
            <button className="send-btn" onClick={()=>sendTextMessage(textMessage, currentChat._id, user._id, setTextMessage)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/></svg>
            </button>
        </Stack>
    </Stack>}
    </>
  )
}

export default ChatBox
