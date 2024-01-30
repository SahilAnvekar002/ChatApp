const {createChat, findUserChats, findChat} = require('../Controllers/chatController')
const express = require('express')

const router = express.Router()

router.post('/', createChat)
router.get('/:userId', findUserChats)
router.get('/find/:firstId/:secondId', findChat)

module.exports = router