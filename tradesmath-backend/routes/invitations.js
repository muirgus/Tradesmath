const express = require('express')
const router = express.Router()

const invitationController = require('../controllers/InvitationController')

router.post('/create', function (req, res) {
  return invitationController.invitation.createInvitation(req, res)
})

router.get('/get', function (req, res) {
  return invitationController.invitation.getAllInvitations(req, res)
})

router.get('/get-invitation-by-id', function (req, res) {
  return invitationController.invitation.getInvitationById(req, res)
})

router.post('/update', function (req, res) {
  return invitationController.invitation.updateInvitation(req, res)
})

module.exports = router
