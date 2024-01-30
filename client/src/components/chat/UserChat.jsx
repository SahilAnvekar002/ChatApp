import { Stack } from "react-bootstrap"
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"
import avatar from "../../assets/avatar.svg"
import { useContext } from "react"
import { ChatContext } from "../../contexts/ChatContext"
import { unreadNotificationsFunc } from "../../utils/unreadNotifications"
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage"
import moment from 'moment'

const UserChat = ({chat, user}) => {
    
    const {recipientUser} = useFetchRecipientUser(chat, user)
    const {onlineUsers, notifications, markThisUserNotificationAsRead} = useContext(ChatContext)

    const unreadNotifications = unreadNotificationsFunc(notifications)
    const thisUserNotifications = unreadNotifications.filter(n=> n?.senderId == recipientUser?._id)

    const { latestMessage } = useFetchLatestMessage(chat)

  return (
    <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between" role="button" onClick={()=>{if(thisUserNotifications?.length !==0){
        markThisUserNotificationAsRead(thisUserNotifications, notifications)
    }}}>
        <div className="d-flex">
            <div className="me-2">
                <img src={avatar} alt="ProfilePic" height="35px"/>
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                {latestMessage&& <div className="text"><span>{`${latestMessage?.text?.length > 20 ? latestMessage?.text[20]+"..." : latestMessage?.text }`}</span></div>}
            </div>
        </div>

        <div className="d-flex flex-column align-items-end">
            {latestMessage &&<div className="date">{moment(latestMessage?.createdAt).calendar()}</div>}
            <div className={thisUserNotifications?.length >0 && "this-user-notifications"}>{thisUserNotifications?.length === 0 ? "": thisUserNotifications?.length}</div>
            <span className={`${onlineUsers.some(onlineUser => onlineUser.userId === recipientUser?._id) && "user-online"}`}></span>
        </div>

    </Stack>
  )
}

export default UserChat
