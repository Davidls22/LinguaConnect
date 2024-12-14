const sanityClient = require('../sanityClient');

exports.getLessonsByLanguage = async (req, res) => {
    const { languageId } = req.params;
  
    try {
      const lessons = await sanityClient.fetch(
        `*[_type == "lesson" && language._ref == $languageId]{
          _id,
          title,
          description,
          content
        }`,
        { languageId }
      );
  
      res.json(lessons);
    } catch (error) {
      console.error('Error fetching lessons by language:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getLessonById = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await sanityClient.getDocument(id);

    if (!lesson || lesson._type !== 'lesson') {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuizByLessonId = async (req, res) => {
    const { lessonId } = req.params;
    try {
      const quiz = await sanityClient.fetch(
        `*[_type == "quiz" && lesson._ref == $lessonId][0]{
          _id,
          title,
          description,
          questions[]->{
            "questionText": text,
            options,
            correctAnswer
          }
        }`,
        { lessonId }
      );
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found for this lesson' });
      }
  
      res.json(quiz);
    } catch (error) {
      console.error(`Error fetching quiz for lesson ID ${lessonId}:`, error);
      res.status(500).json({ message: 'Server error' });
    }
  };