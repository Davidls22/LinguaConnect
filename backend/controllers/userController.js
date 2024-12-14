const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanityClient = require('../sanityClient');
const fs = require('fs');
const moment = require('moment');

exports.getUserProgress = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await sanityClient.fetch(
      `*[_type == "user" && _id == $userId][0]{
        username,
        points,
        badges,
        streak,
        "profileImage": profileImage.asset->url,
        "currentLanguageId": currentLanguage._ref,
        "currentLanguageName": currentLanguage->name,
        availableLanguages[]->{
          _id,
          name
        },
        progress[]{
          lesson->{
            _id,
            title,
            "languageId": language->_id 
          },
          completed
        }
      }`,
      { userId }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProgress = async (req, res) => {
  const { userId } = req.params;
  const { lessonId, completed } = req.body;

  if (!lessonId || completed === undefined) {
    return res.status(400).json({ message: "Lesson ID and completion status are required." });
  }

  try {
    const user = await sanityClient.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedProgress = user.progress || [];
    const lessonIndex = updatedProgress.findIndex((p) => p.lesson._ref === lessonId);

    if (lessonIndex !== -1) {
      updatedProgress[lessonIndex].completed = completed;
    } else {
      updatedProgress.push({
        lesson: { _type: "reference", _ref: lessonId },
        completed,
      });
    }

    const updatedUser = await sanityClient
      .patch(userId)
      .set({ progress: updatedProgress })
      .commit();

    res.status(200).json({ message: "Progress updated successfully", progress: updatedUser.progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateLanguage = async (req, res) => {
  const userId = req.userId;
  const { languageId } = req.body; 

  console.log(`Updating language for userId: ${userId} to languageId: ${languageId}`);

  try {
    const language = await sanityClient.fetch(
      `*[_type == "language" && _id == $languageId][0]`,
      { languageId }
    );

    if (!language) {
      console.log(`Language with _id ${languageId} not found.`);
      return res.status(404).json({ message: 'Language not found' });
    }

    const updatedUser = await sanityClient
      .patch(userId)
      .set({ currentLanguage: { _type: 'reference', _ref: languageId } })
      .commit();

    console.log(`Language updated successfully for userId: ${userId}`, updatedUser);

    res.json({
      message: 'Language updated successfully',
      currentLanguage: language.name,
    });
  } catch (error) {
    console.error('Error updating language:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserPoints = async (req, res) => {
  const { points, userId } = req.body;

  if (!userId || points === undefined) {
    return res.status(400).json({ message: "User ID and points are required." });
  }

  try {
    const user = await sanityClient.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedUser = await sanityClient
      .patch(userId)
      .set({ points: (user.points || 0) + points })
      .commit();

    console.log(`Points updated for user ${userId}:`, updatedUser);

    res.status(200).json({ message: "Points updated successfully", points: updatedUser.points });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ message: "Server error while updating points." });
  }
};


exports.getLeaderboard = async (req, res) => {
  try {
    console.log("Fetching consolidated leaderboard.");
    
    const rawLeaderboard = await sanityClient.fetch(
      `*[_type == "leaderboard"] | order(score desc) {
        _id,
        user->{_id, username}, 
        score,
        date
      }`
    );

    console.log("Raw leaderboard data:", rawLeaderboard);

    const consolidatedLeaderboard = rawLeaderboard.reduce((acc, entry) => {
      const userId = entry.user?._id || "unknown";
      const username = entry.user?.username || "Anonymous";

      const existingEntry = acc.find((item) => item.user._id === userId);

      if (existingEntry) {
        existingEntry.score += entry.score;
      } else {
        acc.push({
          user: { _id: userId, username },
          score: entry.score,
        });
      }

      return acc;
    }, []);

    consolidatedLeaderboard.sort((a, b) => b.score - a.score);

    console.log("Consolidated leaderboard:", consolidatedLeaderboard);

    res.json(consolidatedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error while fetching leaderboard." });
  }
};

exports.updateUserProfileImage = async (req, res) => {
  const userId = req.userId;
  const { imageUri } = req.body;

  try {
    if (!imageUri) {
      return res.status(400).json({ message: "Image URI is required" });
    }

    const fileStream = fs.createReadStream(imageUri.replace('file://', '')); 
    const uploadedAsset = await sanityClient.assets.upload('image', fileStream, {
      filename: `profile-${userId}.jpg`,
    });

    console.log("Uploaded asset:", uploadedAsset);

    const updatedUser = await sanityClient
      .patch(userId)
      .set({ profileImage: { _type: 'image', asset: { _ref: uploadedAsset._id } } })
      .commit();

    console.log("Profile image updated successfully:", updatedUser);
    res.status(200).json({ message: 'Profile image updated successfully', imageUrl: uploadedAsset.url });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: 'Failed to update profile image' });
  }
};

const { v4: uuidv4 } = require("uuid"); 

exports.getFeed = async (req, res) => {
  try {
    const users = await sanityClient.fetch(
      `*[_type == "user"]{
        _id,
        username,
        profileImage {
          asset -> {
            url
          }
        },
        streak,
        points,
        progress[]{
          lesson->{
            _id,
            title
          }
        }
      }`
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const feedItems = [];
    const userMap = new Map(); 

    users.forEach((user) => {
      const userId = user._id;
      const profileImageUrl = user.profileImage?.asset?.url || null;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          username: user.username,
          profileImage: profileImageUrl,
        });
      }

      if (user.streak) {
        feedItems.push({
          id: `streak-${userId}`, 
          user: userMap.get(userId), 
          message: `🔥 ${user.username} reached a streak of ${user.streak} days!`,
          timestamp: moment().subtract(1, 'hours').fromNow(),
        });
      }

      if (user.progress) {
        user.progress
          .filter((lesson) => lesson && lesson.lesson && lesson.lesson._id)
          .forEach((lesson) => {
            feedItems.push({
              id: `lesson-${userId}-${lesson.lesson._id}`,
              user: userMap.get(userId),
              message: `🎉 ${user.username} completed the lesson: ${lesson.lesson.title}.`,
              timestamp: moment().subtract(5, 'minutes').fromNow(),
            });
          });
      }

      if (user.points && user.points > 0) {
        feedItems.push({
          id: `points-${userId}`, 
          user: userMap.get(userId),
          message: `🏅 ${user.username} earned ${user.points} points today!`,
          timestamp: "2 hours ago",
        });
      }
    });

    const uniqueFeed = feedItems.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    const shuffledFeed = uniqueFeed.sort(() => 0.5 - Math.random());

    res.json(shuffledFeed);
  } catch (error) {
    console.error("Error fetching feed data:", error);
    res.status(500).json({ message: "Server error" });
  }
};