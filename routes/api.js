const express   = require('express')
const router    = express.Router()

const CurrencyController    = require('../controllers/CurrencyController')
const SensorController      = require('../controllers/SensorController')

router.get('/currency_converter', CurrencyController.index)
router.get('/sensor_aggregate', SensorController.index)

module.exports  = router