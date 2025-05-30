const express=  require('express');
const payrollController = require('../controllers/payRollController');

const router = express.Router();

router.post('/create', payrollController.create);
router.post('/edit', payrollController.edit);
router.post('/delete', payrollController.delete);
router.post('/view', payrollController.view);
router.post('/viewAll', payrollController.viewAll);
router.post('/viewPosition', payrollController.viewPosition);
router.post('/viewSubPosition', payrollController.viewSubPosition);
router.post('/get-count', payrollController.getCounts);

module.exports = router;