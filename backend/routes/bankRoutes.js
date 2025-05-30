const express = require('express');
const bankController = require('../controllers/bankController');

const router = express.Router();

router.post('/create', bankController.create);
router.post('/edit', bankController.edit);
router.post('/view', bankController.view);
router.post('/delete', bankController.delete);
router.post('/viewAll', bankController.viewAll);

module.exports = router;
