// updateFirestore.mjs (ES modules syntax)
import admin from 'firebase-admin';

admin.initializeApp(); // Initialize Firebase Admin SDK

const updateUserCollection = async (pid, t_name) => {
  const firestore = admin.firestore();
  const userRef = firestore.collection('users').doc(pid);

  try {
    await userRef.update({ t_name });
    console.log(`Updated t_name in users collection for pid ${pid}`);
  } catch (error) {
    console.error('Error updating users collection:', error);
    throw error;
  }
};

export const handler = async (event, context) => {
  try {
    const { t_name, pid, action } = JSON.parse(event.body);

    console.log('Extracted Parameters:');
    console.log('t_name:', t_name);
    console.log('pid:', pid);
    console.log('action:', action);

    // Update user collection if pid is provided
    if (pid && t_name) {
      await updateUserCollection(pid, t_name);
    } else {
      console.log('Missing pid or t_name.');
    }

    // You can add logic to update other Firestore collections based on the action if needed.

    return {
      statusCode: 200,
      body: JSON.stringify('Firestore update successful.'),
    };
  } catch (error) {
    console.error('Error updating Firestore:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error updating Firestore.'),
    };
  }
};
