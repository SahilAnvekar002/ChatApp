const messageModel = require("../Models/messageModel");

const createMessage = async(req, res)=>{
    const {text, chatId, senderId} = req.body

    try {
        const message = new messageModel({chatId: chatId, senderId: senderId, text: text})
        const response = await message.save()
        return res.status(200).json(response)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getMessages = async(req, res)=>{
    const {chatId} = req.params

    try {
        const messages = await messageModel.find({chatId: chatId})
        return res.status(200).json(messages)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

module.exports = {createMessage, getMessages}