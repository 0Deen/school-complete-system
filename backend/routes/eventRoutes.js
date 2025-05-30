const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/create', eventController.create);
router.post('/edit', eventController.edit);
router.post('/delete', eventController.delete);
router.post('/view', eventController.view);
router.post('/viewall', eventController.viewAll);
router.post('/get-count', eventController.getCount);

module.exports = router;
