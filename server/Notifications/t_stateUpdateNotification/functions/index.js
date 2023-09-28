const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const docRef = db.collection("t_stats").doc()
const id = docRef.id

exports.sendNotificationOnT_Stats_Update = functions.firestore
  .document('t_stats/{id}')
  .onUpdate((change, context) => {
    const updatedTeamData = change.after.data();
    const t_name = updatedTeamData.t_name;

    // Add data to the '/notifications/teamUpdate' collection
    const notificationData = {
      t_name: t_name,
      type: 'teamUpdate',
      message: `Update in ${t_name}: ${JSON.stringify(updatedTeamData)}`,
    };

    return db
      .collection('notifications')
      .doc()// Automatically generate a new ID for each notification
      .set(notificationData);
    
});
