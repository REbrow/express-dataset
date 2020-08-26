var express = require('express');
var router = express.Router();
var actor_controller = require('../controllers/actors');
// Routes related to actor.

router.put('/', actor_controller.updateActor);
router.get('/', actor_controller.getAllActors);
router.get('/streak', actor_controller.getStreak);

module.exports = router;