const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/create', accountController.create);
router.post('/edit', accountController.update);
router.post('/delete', accountController.delete);
router.post('/view', accountController.view);
router.post('/viewAll', accountController.viewAll);
router.post('/view-specified', accountController.viewSpecified);
router.post('/get-count', accountController.getCount);

module.exports = router;