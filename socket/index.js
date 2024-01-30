const { Server } = require("socket.io");

const io = new Server({ 
    cors : "http://localhost:5173/" 
});

let onlineUsers = []

io.on("connection", (socket) => {
    console.log("New connection: ",socket.id)

    socket.on('addNewUser', (userId)=>{
        !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({
            userId : userId,
            socketId: socket.id
        })
        io.emit("getOnlineUsers", onlineUsers)
        console.log(onlineUsers)
    })

    socket.on('sendMessage', (message)=>{
        const user = onlineUsers.find(user=> user.userId === message.recipientId)

        if(user){
            io.to(user.socketId).emit('getMessage', message)
            io.to(user.socketId).emit('getNotification', {
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            })
        }
    })

    /*socket.on('createChat', (chat)=>{
        const user = onlineUsers.find(user=> user.userId === chat.recipientId)

        if(user){
            io.to(user.socketId).emit('getCreatedChat', chat)
        }
    })*/

    socket.on("disconnect", ()=>{
        onlineUsers = onlineUsers.filter((user)=>
            user.socketId !== socket.id
        )

        io.emit("getOnlineUsers", onlineUsers)
        console.log(onlineUsers)
    })

});



io.listen(3000);