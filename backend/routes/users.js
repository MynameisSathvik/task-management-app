const express = require('express');
const router = express.Router();
const { getUsers, getUserProfile, updateProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
