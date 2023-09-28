import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import AWS from 'aws-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountKeyPath = `${__dirname}/serviceAccountKey.json`;

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
    const serviceAccount = await import(serviceAccountKeyPath, { assert: { type: "json" } }).then((module) => module.default);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const sns = new AWS.SNS();

export const handler = async (event, context) => {
    const firestore = admin.firestore();

    const receiverPid = Number(event.receiverId); // Replace this with the receiver's pid
    const senderPid = 911; // Replace this with the sender's pid

    // Fetch all documents from the 'users' collection
    const usersSnapshot = await firestore.collection('users').get();

    // Log all user details
    usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        console.log(`User with pid ${userDoc.id}:`, userData);
    });

    // Fetch the receiver and sender details from the 'users' collection using pid as a filter
    const receiverSnapshot = await firestore.collection('users').where('pid', '==', receiverPid).get();
    const senderSnapshot = await firestore.collection('users').where('pid', '==', senderPid).get();

    // Since a query can potentially return multiple documents, we'll just use the first one
    const senderData = senderSnapshot.docs.length ? senderSnapshot.docs[0].data() : null;
    const receiverData = receiverSnapshot.docs.length ? receiverSnapshot.docs[0].data() : null;

    if (!senderData || !receiverData) {
        console.log('Error: Sender or Receiver data not found.');
        return { statusCode: 404, body: 'Sender or Receiver data not found.' };
    }

    console.log('Sender Data:', senderData);
    console.log('Receiver Data:', receiverData);

    // Get the sender's team name, sender's name, and receiver's name
    const t_name = senderData.t_name;
    const senderName = senderData.pname;
    const receiverName = receiverData.pname;

    // Get the sender's and receiver's emails
    const senderEmail = senderData.email;
    const receiverEmail = receiverData.email;

    // Add the request to the 'p_req' collection
    await firestore.collection('p_req').add({
        t_name,
        sender: senderName,
        receiver: receiverName,
        status: 'pending'
    });

    // Construct the accept and reject URLs with query parameters
    const acceptUrl = `https://5ku1pynps6.execute-api.us-east-1.amazonaws.com/default/url_extract?pid=${receiverPid}&t_name=${t_name}&action=accept`;
    const rejectUrl = `https://5ku1pynps6.execute-api.us-east-1.amazonaws.com/default/url_extract?pid=${receiverPid}&t_name=${t_name}&action=reject`;

    // Construct the invitation message
    const invitationMessage = `${receiverName}, you have been invited to join team ${t_name}.\nTo accept, visit ${acceptUrl}\nTo reject, visit ${rejectUrl}`;
    // Publish the invitation message to the SNS topic
    const topicArn = 'arn:aws:sns:us-east-1:400121257182:sample_request'; // use sns arn
    const snsParams = {
        TopicArn: topicArn,
        Message: invitationMessage
    };

    try {
        await sns.publish(snsParams).promise();
        console.log(`Invitation message sent successfully to SNS topic: ${topicArn}`);
    } catch (error) {
        console.error(`Error sending invitation message: ${error}`);
        return { statusCode: 500, body: 'Error sending invitation message.' };
    }

    return { statusCode: 200, body: JSON.stringify('Invitation sent successfully!') };
};