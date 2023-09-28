import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse(await readFile(new URL('./serviceAccountKey.json', import.meta.url)));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  const teamName = event.sessionState.intent.slots.teamName.value.originalValue;

  const docRef = db.collection('t_stats').where('t_name', '==', teamName);
  const teamScore = await docRef.get().then((snapshot) => {
    if (!snapshot.empty) {
      return snapshot.docs[0].data().total_pts;
    } else {
      return 'No such document!';
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
  });

  const response = {
    sessionState: {
      intent: {
        name: event.sessionState.intent.name,
        slots: event.sessionState.intent.slots,
        state: "Fulfilled", // Changed this to Fulfilled
        confirmationState: "None"
      },
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      }
    },
    messages: [
      {
        contentType: "PlainText",
        content: `The score for ${teamName} is ${teamScore}`
      }
    ]
  };

  return response;
};
