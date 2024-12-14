const express = require('express');
const router = express.Router();
const { getLessonsByLanguage, getLessonById, getQuizByLessonId } = require('../controllers/lessonController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/language/:languageId', getLessonsByLanguage);
router.get('/:id', verifyToken, getLessonById); 
router.get('/:lessonId/quiz', verifyToken, getQuizByLessonId); 



module.exports = router;