import { useContext } from "react"
import { ChatContext } from "../../contexts/ChatContext"
import { AuthContext } from "../../contexts/AuthContext"

const PotentialChats = () => {
    const {user} = useContext(AuthContext)
    const {potentialChats, createChat, onlineUsers} = useContext(ChatContext)

  return (
    <div className="all-users">
        {potentialChats && potentialChats.map((u, index)=>{
            return(
                <div className="single-user" key={index} onClick={()=>createChat(user._id, u._id)}>
                    {u.name}
                    <span className={`${onlineUsers.some(onlineUser => onlineUser.userId === u?._id) && "user-online"}`}></span>
                </div>
            )
        })}
    </div>
  )
}

export default PotentialChats
