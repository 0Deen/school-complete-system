const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register',userController.create);
router.post('/login',userController.login);
router.post('/edit',userController.edit);
router.post('/delete',userController.delete);
router.post('view',userController.view);
router.post('/viewall',userController.viewAll);

module.exports = router;