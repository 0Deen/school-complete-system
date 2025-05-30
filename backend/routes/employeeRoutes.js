const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/create', employeeController.create);
router.post('/edit', employeeController.edit);
router.post('/delete', employeeController.delete);
router.post('/view', employeeController.view);
router.post('/viewall', employeeController.viewAll);
router.post('/find-by-position', employeeController.findByPosition);
router.post('/find-by-position-name', employeeController.findByPositionName);
router.post('/get-detailed-employees', employeeController.getDetailedEmployees);
router.post('/get-count', employeeController.getCounts);

module.exports = router;
