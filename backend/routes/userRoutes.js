const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/userController');
const { getUserProgress, updateLanguage, updateUserProgress, updateUserProfileImage, getFeed } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { updateUserPoints } = require('../controllers/userController');

router.post('/update-points', verifyToken, updateUserPoints);
router.get('/leaderboard', verifyToken, getLeaderboard);
router.get('/progress', verifyToken, getUserProgress);
router.get('/feed', verifyToken, getFeed);
router.patch('/:userId/progress', verifyToken, updateUserProgress);
router.patch('/language', verifyToken, updateLanguage);
router.patch('/profile-image', verifyToken, updateUserProfileImage);

module.exports = router;