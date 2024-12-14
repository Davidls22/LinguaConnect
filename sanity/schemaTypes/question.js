export default {
    name: 'question',
    type: 'document',
    title: 'Question',
    fields: [
      { name: 'text', type: 'string', title: 'Question Text' },
      { name: 'options', type: 'array', of: [{ type: 'string' }], title: 'Options' },
      { name: 'correctAnswer', type: 'string', title: 'Correct Answer' },
    ],
  };