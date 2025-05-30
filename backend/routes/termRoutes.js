const express = require('express');
const router = express.Router();
const termController = require('../controllers/termController');

router.post('/create', termController.create);
router.post('/edit', termController.edit);
router.post('/delete', termController.delete);
router.post('/view', termController.view);
router.post('/viewYear', termController.viewByYear);
router.post('/viewAll', termController.viewAll);

module.exports = router;