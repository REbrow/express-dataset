var express = require('express');
var router = express.Router();
var event_controller = require('../controllers/events');
// Routes related to event

router.post('/', event_controller.addEvent);
router.get('/', event_controller.getAllEvents);
router.get('/actors/:id', event_controller.getByActor);


module.exports = router;