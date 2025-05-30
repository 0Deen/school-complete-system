const express = require('express');
const categoryController = require('../controllers/inventoryCategoryController');

const router = express.Router();

router.post('/create', categoryController.create);
router.post('/edit', categoryController.edit);
router.post('/delete', categoryController.delete);
router.post('/view', categoryController.view);
router.post('/viewAll', categoryController.viewAll);

module.exports = router