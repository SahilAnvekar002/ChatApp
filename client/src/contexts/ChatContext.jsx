import { createContext, useState, useEffect, useCallback } from "react";
import {baseUrl, getRequest, postRequest} from '../utils/services'
import {io} from 'socket.io-client'

export const ChatContext = createContext()

export const ChatContextProvider = ({children, user}) =>{
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [notifications, setNotifications] = useState([])
    const [allUsers, setAllUsers] = useState([])
    
    const [createdChat, setCreatedChat] = useState(null)

    //add user
    useEffect(() => {
        if(socket === null){
            return
        }

        if(user?._id){
            socket.emit("addNewUser", user?._id)
            socket.on("getOnlineUsers", (res)=>{
                setOnlineUsers(res)
            })
        }

        return ()=>{
            socket.off("getOnlineUsers")
        }

    }, [socket])
    //initialization
    useEffect(() => {
        const newSocket = io("http://localhost:3000")
        setSocket(newSocket)

        return ()=>{
            newSocket.disconnect()
        }

    }, [user])
    //send message
    useEffect(() => {
        if (socket == null){
            return
        }

        const recipientId = currentChat?.members.find((id)=> id !== user?._id )

        socket.emit("sendMessage", {...newMessage, recipientId})

    }, [newMessage])
    //receive message
    useEffect(() => {
        if (socket == null){
            return
        }

        socket.on("getMessage", res=>{
            if(currentChat?._id !== res.chatId){
                return
            }
            setMessages((prev)=> [...prev, res])  
        })

        socket.on("getNotification", res=>{
            const isChatOpen = currentChat?.members.some((id)=> id === res.senderId)

            if(isChatOpen){
                setNotifications((prev) => [{...res, isRead: true}, ...prev])
            }
            else{
                setNotifications((prev) => [res, ...prev])
            }  
        })

        return ()=>{
            socket.off("getMessage")
            socket.off("getNotification")
        }

    }, [socket, currentChat])
    //create chat
    /*useEffect(() => {
        if (socket == null){
            return
        }
        
        const recipientId = createdChat?.members.find((id)=> id !== user?._id )
        socket.emit("createChat", {...createdChat, recipientId})

    }, [userChats])*/
    //get created chat
    /*useEffect(() => {
        if (socket == null){
            return
        }
        
        socket.on("getCreatedChat", res=>{
            setUserChats((prev)=> [...prev, res])  
        })

    }, [socket])*/
    
    useEffect(() => {
        const getUsers = async() =>{
            const response = await getRequest(`${baseUrl}/users`)

            if(response.error){
                return console.log("Error fetching users: ", response)
            }

            setAllUsers(response)

            const pChats = response.filter((u)=>{
                let isChatCreated = false

                if(u._id === user?._id){
                    return false
                }
                
                if(userChats){
                    isChatCreated = userChats?.some((chat)=>{
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }

                return !isChatCreated

            })

            setPotentialChats(pChats)
        }

        getUsers()
    }, [userChats])
    

    useEffect(() => {
        const getUserChats = async()=>{
            if(user?._id){
                setIsUserChatsLoading(true)
                setUserChatsError(null)
        
                const response = await getRequest(`${baseUrl}/chats/${user._id}`)
                
                setIsUserChatsLoading(false)
                
                if(response?.error){
                    return setUserChatsError(response)
                }
                
                setUserChats(response)
            }
        }

        getUserChats()
    
    }, [user, notifications])

    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat)
    }, [])

    useEffect(() => {
        const getMessages = async() =>{
            setIsMessagesLoading(true)
            setMessagesError(null)

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)

            setIsMessagesLoading(false)

            if(response.error){
                return setMessagesError(response)
            }

            setMessages(response)
        }

        getMessages()
    }, [currentChat])
    
    const createChat = useCallback(async(firstId, secondId)=>{
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({firstId: firstId, secondId:secondId}))

        if(response.error){
            return console.log("Error creating chat: ", response)
        }

        setUserChats((prev) => [...prev, response])

        setCreatedChat(response)
    },[])

    const sendTextMessage = useCallback(async(textMessage, currentChatId, senderId, setTextMessage)=>{

        if(!textMessage){
            return console.log("Error sending message: ", response)
        }

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({text: textMessage, chatId: currentChatId, senderId: senderId}))

        if(response.error){
            return setSendTextMessageError(response)
        }

        setNewMessage(response)
        setTextMessage("")
        setMessages((prev)=>[...prev, response])

    }, [])

    const markAsRead = useCallback((notifications)=>{
        const mNotifications = notifications?.map(n=>{
            return {...n, isRead: true}
        })

        setNotifications(mNotifications)
    }, [])

    const markOneAsRead = useCallback((n, userChats, user, notifications)=>{
        const desiredChat = userChats.find((chat)=>{
            const chatMembers = [user?._id, n.senderId]
            const isDesiredChat = chat?.members.every((member)=>{
                return chatMembers.includes(member)
            })

            return isDesiredChat
        })

        const mNotifications = notifications.map(mn=>{
            if(n.senderId === mn.senderId){
                return {...n, isRead:true}
            }
            else{
                return mn
            }
        })

        setCurrentChat(desiredChat)
        setNotifications(mNotifications)

    },[])

    const markThisUserNotificationAsRead = useCallback((thisUserNotifications, notifications)=>{
        const mNotifications = notifications.map(el=>{
            let notification;

            thisUserNotifications.forEach(n=>{
                if(n.senderId === el.senderId){
                    notification = {...n, isRead: true}
                }
                else{
                    notification = el
                }
            })

            return notification
        })

        setNotifications(mNotifications)

    }, [])

    return(
        <ChatContext.Provider value={{userChats, isUserChatsLoading, userChatsError, potentialChats, currentChat, createChat, updateCurrentChat, messages, isMessagesLoading, messagesError, sendTextMessage, newMessage, sendTextMessageError, onlineUsers, notifications, allUsers, markAsRead, markOneAsRead, markThisUserNotificationAsRead}}>
            {children}
        </ChatContext.Provider>
    )
}