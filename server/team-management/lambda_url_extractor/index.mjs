// index.mjs (ES modules syntax)
import { URLSearchParams } from 'url';
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' }); // Replace with your desired region

const invokeUpdateFirestoreLambda = async (t_name, pid, action) => {
  const lambda = new AWS.Lambda();
  const functionName = 'updateFirestore'; // Replace with the actual name of the updateFirestore Lambda function
  const payload = JSON.stringify({ t_name, pid, action });

  const params = {
    FunctionName: functionName,
    InvocationType: 'Event', // Use 'Event' to invoke asynchronously
    Payload: payload,
  };

  try {
    await lambda.invoke(params).promise();
    console.log('Successfully invoked updateFirestore Lambda function.');
  } catch (error) {
    console.error('Error invoking updateFirestore Lambda function:', error);
    throw error;
  }
};

export const handler = async (event, context) => {
  try {
    const queryStringParameters = event.queryStringParameters;
    const { t_name, pid, action } = queryStringParameters;

    console.log('Extracted Parameters:');
    console.log('t_name:', t_name);
    console.log('pid:', pid);
    console.log('action:', action);

    // Always invoke the updateFirestore Lambda function with all three parameters
    await invokeUpdateFirestoreLambda(t_name, pid, action);

    let message;
    if (action === 'accept') {
      message = 'Joined the team successfully.';
    } else if (action === 'reject') {
      message = 'Rejected the team request.';
    } else {
      message = 'Invalid action.';
    }

    return {
      statusCode: 200,
      body: JSON.stringify(message),
    };
  } catch (error) {
    console.error('Error processing URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error processing URL and Lambda invocation.'),
    };
  }
};

















/*
// index.mjs (ES modules syntax)
import { URLSearchParams } from 'url';

export const handler = async (event, context) => {
  try {
    const queryStringParameters = event.queryStringParameters;
    const { t_name, pid, action } = queryStringParameters;

    console.log('Extracted Parameters:');
    console.log('t_name:', t_name);
    console.log('pid:', pid);
    console.log('action:', action);

    let message;
    if (action === 'accept') {
      message = 'Joined the team successfully.';
    } else if (action === 'reject') {
      message = 'Rejected the team request.';
    } else {
      message = 'Invalid action.';
    }

    return {
      statusCode: 200,
      body: JSON.stringify(message),
    };
  } catch (error) {
    console.error('Error processing URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error processing URL.'),
    };
  }
};
*/