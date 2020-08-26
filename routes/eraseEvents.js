var express = require('express');
var router = express.Router();
var erase_controller = require('../controllers/events');
// Route related to delete events

router.delete('/', erase_controller.eraseEvents);

module.exports = router;