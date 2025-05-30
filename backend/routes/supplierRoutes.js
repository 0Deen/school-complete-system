const express = require('express');
const supplierController = require('../controllers/supplierController');

const router = express.Router();

router.post('/create', supplierController.create);
router.post('/delete', supplierController.delete);
router.post('/edit', supplierController.edit);
router.post('/view', supplierController.view);
router.post('/viewAll', supplierController.viewAll);
router.post('/viewProduct', supplierController.viewProduct);
router.post('/get-count', supplierController.getCount);

module.exports = router;