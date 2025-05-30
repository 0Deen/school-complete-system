const express = require('express');
const router = express.Router();
const voteheadController = require('../controllers/voteheadController');

router.post('/create', voteheadController.create);
router.post('/edit', voteheadController.edit);
router.post('/delete', voteheadController.delete);
router.post('/view', voteheadController.view);
router.post('/viewTerm', voteheadController.viewTerm);
router.post('/viewyear', voteheadController.viewYear);
router.post('/viewAll', voteheadController.viewAll);
router.post('/view-detailed', voteheadController.viewDetailed);

module.exports = router;