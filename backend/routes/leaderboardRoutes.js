const express = require('express');
const router = express.Router();
const { updateLeaderboard, getLeaderboard } = require('../controllers/leaderboardController');
const { verifyToken } = require('../middleware/authMiddleware'); 

router.post('/', verifyToken, updateLeaderboard);

router.get('/', getLeaderboard);

module.exports = router;