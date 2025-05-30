const express = require('express');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.post('/create', inventoryController.create);
router.post('/edit', inventoryController.edit);
router.post('/delete', inventoryController.delete);
router.post('/view', inventoryController.view);
router.post('/viewAll', inventoryController.viewAll);
router.post('/get-count', inventoryController.getCount);

module.exports = router