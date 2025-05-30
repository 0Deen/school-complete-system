const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/create', transactionController.create);
router.post('/edit', transactionController.edit);
router.post('/delete', transactionController.delete);
router.post('/view', transactionController.view);
router.post('/viewAll', transactionController.viewAll);

module.exports = router;