const express = require('express')
const { createTicket, getUserTickets,replyToTicket,getUserTicketsByEmail,closeTicket } = require("../controllers/ticketController")

const router = express.Router()

router.route("/createTicket/:userId").post(createTicket)
router.route("/getUserTickets/:userId").get(getUserTickets)
router.route("/replyToTicket/:ticketId").post(replyToTicket)
router.route("/getUserTicketsByEmail").get(getUserTicketsByEmail)
router.route("/closeTicket").get(closeTicket)

module.exports = router