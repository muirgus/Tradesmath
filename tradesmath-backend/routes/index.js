const express = require('express')
const { ensureAuthorized } = require('../middleware/auth')
const router = express.Router()

const accountRoutes = require('./account')
const topicRoutes = require('./topics')
const invitationRoutes = require('./invitations')
const questionRoutes = require('./questions')
const analyticsRoutes = require('./analytics')

router.use('/account', ensureAuthorized, accountRoutes)
router.use('/topics', ensureAuthorized, topicRoutes)
router.use('/invitations', ensureAuthorized, invitationRoutes)
router.use('/questions', ensureAuthorized, questionRoutes)
router.use('/analytics', ensureAuthorized, analyticsRoutes)

module.exports = router
