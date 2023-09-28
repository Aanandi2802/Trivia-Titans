const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const docRef = db.collection("t_stats").doc()
const id = docRef.id

exports.updateAchievementsOnNewScore = functions.firestore
  .document('results/{id}')
  .onCreate(async (snapshot, context) => {
    const newScoreData = snapshot.data();
    const pid = newScoreData.pid;
    const score = newScoreData.score;

    const achievementLevels = ['level1', 'level2', 'level3', 'level4', 'level5'];
    let achievementLevel = 1;

    // Determine the achievement level based on the score
    for (let i = 0; i < achievementLevels.length; i++) {
      if (score > (i + 1) * 50) {
        achievementLevel = i + 1;
      } else {
        break;
      }
    }

    // Add data to the 'achievements' collection for the user and the corresponding level
    const achievementData = {
      pid: pid,
      score: score,
    };

    try {
      // Use batched writes to update the 'achievements' collection
      const batch = db.batch();

      // Create or update the document in the corresponding achievement level subcollection
      const achievementRef = db.collection('achievements').doc(achievementLevels[achievementLevel - 1]).collection('userAchievements').doc(encodeURIComponent(pid));
      batch.set(achievementRef, achievementData);

      await batch.commit();

      console.log(`Achievement level ${achievementLevel} added for user ${pid}.`);
    } catch (error) {
      console.error('Error updating achievements:', error);
    }
  });
