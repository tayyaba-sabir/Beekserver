const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const errorHandler = require('../middlewares/errorHandler')

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/dashboard', authMiddleware.authenticate, userController.getUserDashboard);

router.post('/:jobId/apply', authMiddleware.authenticate, uploadMiddleware.single('resume'), userController.applyToJob);
router.use(errorHandler);

module.exports = router;
