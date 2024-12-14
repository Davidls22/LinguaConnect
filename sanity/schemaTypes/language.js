export default {
    name: 'language',
    type: 'document',
    title: 'Language',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Language Name',
      },
      {
        name: 'code',
        type: 'string',
        title: 'Language Code',
        description: 'ISO 639-1 Code (e.g., en, es, fr)',
      },
      {
        name: 'description',
        type: 'text',
        title: 'Description',
      },
      {
        name: 'flagEmoji',
        type: 'string',
        title: 'Flag Emoji',
        description: 'Emoji representing the language (e.g., 🇺🇸 for English, 🇪🇸 for Spanish)',
      },
    ],
  };