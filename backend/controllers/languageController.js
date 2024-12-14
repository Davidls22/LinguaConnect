const sanityClient = require('../sanityClient');

exports.getAllLanguages = async (req, res) => {
    try {
      const languages = await sanityClient.fetch(
        `*[_type == "language"]{
          _id,
          name,
          code,
          description
        }`
      );
  
      const languagesWithFlagEmoji = languages.map(language => ({
        ...language,
        flagEmoji: getFlagEmoji(language.code)
      }));
  
      res.json(languagesWithFlagEmoji);
    } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const getFlagEmoji = (code) => {
    if (!code) return null;
  
    const countryCode = code.toUpperCase();
  
    return countryCode
      .split('')
      .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join('');
  };