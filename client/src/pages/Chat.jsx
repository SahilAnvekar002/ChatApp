import { useContext } from "react"
import { ChatContext } from "../contexts/ChatContext"
import {AuthContext} from '../contexts/AuthContext'
import {Container, Stack} from 'react-bootstrap'
import UserChat from "../components/chat/UserChat"
import PotentialChats from "../components/chat/PotentialChats"
import ChatBox from "../components/chat/ChatBox"

const Chat = () => {
  const {userChats, isUserChatsLoading, userChatsError, updateCurrentChat} = useContext(ChatContext)
  const {user} = useContext(AuthContext)

  return (
    <Container>
      <PotentialChats/>
      {userChats?.length < 1 ? null : 
      <Stack className="align-items-start" direction="horizontal" gap={4}>
        <Stack className="flex-grow-0 pe-3" style={{height: '85vh'}} gap={3}>
          {isUserChatsLoading && <p>Loading chats</p>}
          {userChats?.map((chat, index)=>{
            return (
              <div key={index} onClick={()=>updateCurrentChat(chat)}>
                <UserChat chat={chat} user={user}/>
              </div>
            )
          })}
        </Stack>
        <ChatBox/>
      </Stack>}
    </Container>
  )
}

export default Chat

