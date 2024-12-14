export default {
    name: 'user',
    type: 'document',
    title: 'User',
    fields: [
      { name: 'email', type: 'string', title: 'Email' },
      { name: 'password', type: 'string', title: 'Password' },
      { name: 'username', type: 'string', title: 'Username' },
      { name: 'points', type: 'number', title: 'Points', initialValue: 0 },
      { name: 'badges', type: 'array', of: [{ type: 'string' }], title: 'Badges' },
      { name: 'streak', type: 'number', title: 'Streak', initialValue: 0 },
      { name: 'lastLoginDate', type: 'datetime', title: 'Last Login Date' },
      {
        name: 'profileImage',
        type: 'image',
        title: 'Profile Image',
        options: {
          hotspot: true, 
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative Text',
            description: 'Describe the image for accessibility purposes',
          },
        ],
      },
      {
        name: 'currentLanguage',
        type: 'reference',
        to: [{ type: 'language' }],
        title: 'Current Language',
      },
      {
        name: 'progress',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'lesson', type: 'reference', to: [{ type: 'lesson' }] },
              { name: 'completed', type: 'boolean', title: 'Completed' },
            ],
          },
        ],
        title: 'Progress',
      },
      {
        name: 'availableLanguages',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'language' }] }],
        title: 'Available Languages',
      },
    ],
  };