const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/create', classController.create);
router.post('/edit', classController.edit);
router.post('/delete', classController.delete);
router.post('/view', classController.view);
router.post('/view-detailed-class', classController.viewDetailedClass);
router.post('/viewall', classController.viewAll);
router.post('/view-detailed',classController.viewDetailedClasses);
router.post('/get-count',classController.getCounts);

module.exports = router;