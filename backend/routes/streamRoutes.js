const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');

router.post('/create', streamController.create);
router.post('/edit', streamController.edit);
router.post('/delete', streamController.delete);
router.post('/view', streamController.view);
router.post('/viewall', streamController.viewAll);

module.exports = router;