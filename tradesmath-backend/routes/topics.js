const express = require('express')
const router = express.Router()

const topicsController = require('../controllers/TopicsController')

router.post('/create', function (req, res) {
  return topicsController.topic.createTopics(req, res)
})

router.get('/get', function (req, res) {
  return topicsController.topic.getAllTopics(req, res)
})

router.get('/student-topics', function (req, res) {
  return topicsController.topic.studentTopics(req, res)
})

router.get('/get-topic-by-id', function (req, res) {
  return topicsController.topic.getTopicsById(req, res)
})

router.post('/update', function (req, res) {
  return topicsController.topic.updateTopics(req, res)
})

router.delete('/delete', function (req, res) {
  return topicsController.topic.deleteTopics(req, res)
})

module.exports = router
