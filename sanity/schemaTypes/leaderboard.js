export default {
    name: 'leaderboard',
    type: 'document',
    title: 'Leaderboard',
    fields: [
        {
            name: 'user',
            type: 'reference',
            title: 'User',
            to: [{ type: 'user' }], 
          },
      {
        name: 'score',
        type: 'number',
        title: 'Score',
      },
      {
        name: 'date',
        type: 'datetime',
        title: 'Date Achieved',
      },
    ],
  };