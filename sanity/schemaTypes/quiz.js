export default {
    name: 'quiz',
    type: 'document',
    title: 'Quiz',
    fields: [
      { name: 'title', type: 'string', title: 'Title' },
      {
        name: 'questions',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'question' }] }],
        title: 'Questions',
      },
      {
        name: 'lesson',
        title: 'Related Lesson',
        type: 'reference',
        to: [{ type: 'lesson' }],
      },
    ],
  };