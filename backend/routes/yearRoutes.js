const express = require('express');
const router = express.Router();
const yearController = require('../controllers/yearController');

router.post('/create', yearController.create);
router.post('/edit', yearController.edit);
router.post('/delete', yearController.delete);
router.post('/view', yearController.view);
router.post('/viewAll', yearController.viewAll);

module.exports = router;