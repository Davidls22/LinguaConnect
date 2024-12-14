const sanityClient = require('../sanityClient');

exports.updateLeaderboard = async (req, res) => {
    const { userId, username, score } = req.body;
  
    if (!userId || !username || score === undefined) {
      return res
        .status(400)
        .json({ message: "User ID, username, and score are required." });
    }
  
    try {
      const existingEntry = await sanityClient.fetch(
        `*[_type == "leaderboard" && user._ref == $userId][0]`,
        { userId }
      );
  
      if (existingEntry) {
        const updatedEntry = await sanityClient
          .patch(existingEntry._id)
          .set({
            score: (existingEntry.score || 0) + score,
          })
          .commit();
  
        return res.status(200).json(updatedEntry);
      } else {
        const newEntry = {
          _type: "leaderboard",
          user: { _type: "reference", _ref: userId },
          score,
          date: new Date().toISOString(),
        };
  
        const createdEntry = await sanityClient.create(newEntry);
        return res.status(201).json(createdEntry);
      }
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      res
        .status(500)
        .json({ message: "Server error while updating leaderboard." });
    }
  };

exports.getLeaderboard = async (req, res) => {
    console.log('Fetching consolidated leaderboard.');
  
    try {
      const leaders = await sanityClient.fetch(
        `*[_type == "leaderboard"] | order(score desc) {
          user->{_id, username}, 
          score,
          date
        }`
      );
  
      console.log('Raw leaderboard data:', leaders);
  
      const consolidatedLeaderboard = leaders.reduce((acc, entry) => {
        const username = entry.user?.username || 'Unknown User';
        const userId = entry.user?._id || 'unknown';
  
        const existingUser = acc.find((item) => item.user._id === userId);
        if (existingUser) {
          existingUser.score += entry.score;
        } else {
          acc.push({
            user: { _id: userId, username },
            score: entry.score,
          });
        }
        return acc;
      }, []);
  
      consolidatedLeaderboard.sort((a, b) => b.score - a.score);
  
      console.log('Consolidated leaderboard:', consolidatedLeaderboard);
      res.json(consolidatedLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: 'Server error while fetching leaderboard.' });
    }
  };