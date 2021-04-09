var express = require('express')
var controller = require('../controllers/overall.server.controller')
var individualController = require('../controllers/individual.server.controller')

var router = express.Router()

router.get('/',controller.showLandingPage)
router.get('/Overall', controller.renderAnalytics)
router.get('/Overall/DataTop', controller.getAnalytics_Top)//performs queries that update analytics
router.get('/Overall/DataBottom', controller.getAnalytics_Bottom)
router.get('/Overall/DataLSGroup', controller.getAnalytics_LG_SG)
router.get('/Overall/DataLHist', controller.getAnalytics_LH)
router.get('/Overall/DataSHist', controller.getAnalytics_SH)
router.get('/Overall/graph', controller.getOverallGraphData)
router.get('/Overall/getNum', controller.getOverallNum)
router.get('/Individual', individualController.getIndividualAnalyticsLanding);
router.get('/Individual/getData1', individualController.getData1);
router.get('/Individual/getList', individualController.getIndividualAnalyticsSPA);
router.post('/Individual/results', individualController.getIndividualAnalyticsResults);
router.post('/signup', controller.signUp);
module.exports = router
