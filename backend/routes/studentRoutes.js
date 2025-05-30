const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/create', studentController.create);
router.post('/view', studentController.view);
router.post('/delete', studentController.delete);
router.post('/edit', studentController.edit);
router.post('/search', studentController.search);
router.post('/view-detailed-student', studentController.viewDetailed);
router.post('/view-detailed-students', studentController.viewAllDetailed);
router.post('/viewAll', studentController.viewall);
router.post('/get-count', studentController.getCounts);
router.post('/get-fee', studentController.getFeeHistory);

module.exports = router;