const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const docRef1 = db.collection("testgames").doc()
const testgames_id = docRef1.id

exports.sendNotificationOnNewGame = functions.firestore
  .document('testgames/{testgames_id}')
  .onCreate((snapshot, context) => {
    const newGameData = snapshot.data();
    const newGameId = context.params.testgames_id;
    const newGameName = newGameData.name; 

    // Add data to the '/notifications/newGame' collection
    const notificationData = {
      id: newGameId,
      name: newGameName,
      type: 'newGame',
      message: `New game ${newGameName} has been created.`,
    };

    return db
      .collection('notifications')
      // .collection('newGame') // Create a subcollection for individual notifications
      .doc() // Automatically generate a new ID for each notification
      .set(notificationData);
  });

  //send notifications when statistics of teams changes
const docRef2 = db.collection("t_stats").doc()
const t_stats_id = docRef2.id

  exports.sendNotificationOnT_Stats_Update = functions.firestore
  .document('t_stats/{t_stats_id}')
  .onUpdate((change, context) => {
    
    const updatedTeamData = change.after.data();
    const t_name = updatedTeamData.t_name;

    // Add data to the '/notifications/teamUpdate' collection
    const notificationData = {
      t_name: t_name,
      type: 'teamUpdate',
      message: `Update in ${t_name}: Games played: ${updatedTeamData.games_played}, Games won: ${updatedTeamData.games_won}, Total points: ${updatedTeamData.total_pts}`
    };

    return db
      .collection('notifications')
      .doc()// Automatically generate a new ID for each notification
      .set(notificationData);
    
});

const docRef3 = db.collection("teams").doc()
const teams_id = docRef3.id

exports.sendNotificationOnTeamUpdate = functions.firestore
  .document('teams/{teams_id}')
  .onUpdate((change, context) => {
    const updatedTeamData = change.after.data();
    const t_name = updatedTeamData.t_name;

    // Add data to the '/notifications/teamUpdate' collection
    const notificationData = {
      t_name: t_name,
      type: 'teamUpdate',
      message: `Update in ${t_name}, Team Desctiption: ${updatedTeamData.t_desc}`
    };

    return db
      .collection('notifications')
      // .doc('teamUpdate')
      // .collection('t_update') // Create a subcollection for individual notifications
      .doc() // Automatically generate a new ID for each notification
      .set(notificationData);
  });

const docRef4 = db.collection("results").doc()
const results_id = docRef4.id

//achievement updates oon new scorre
exports.updateAchievementsOnNewScore = functions.firestore
  .document('results/{results_id}')
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

