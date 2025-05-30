const express = require('express');
const bursaryController = require('../controllers/bursaryController');

const router = express.Router();

router.post('/create', bursaryController.create);
router.post('/delete', bursaryController.delete);
router.post('/edit', bursaryController.edit);
router.post('/view', bursaryController.view);
router.post('/viewAll', bursaryController.viewAll);

module.exports = router;
