const express = require('express');
const blockController = require('../controllers/blockController');

const router = express.Router();

router.post('/create',blockController.create);
router.post('/edit',blockController.edit);
router.post('/delete',blockController.delete);
router.post('/view',blockController.view);
router.post('/viewall',blockController.viewAll);

module.exports = router;