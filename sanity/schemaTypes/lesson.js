export default {
  name: 'lesson',
  type: 'document',
  title: 'Lesson',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'description', type: 'string', title: 'Description' },
    { name: 'content', type: 'text', title: 'Content' },
    {
      name: 'language',
      type: 'reference',
      to: [{ type: 'language' }],
      title: 'Language',
    },
  ],
};