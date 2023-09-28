import admin from "firebase-admin";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountKeyPath = path.join(__dirname, "serviceAccountKey.json");

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    await fs.readFile(serviceAccountKeyPath, "utf8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const handler = async (event, context) => {
  try {
    console.log("Event:", event);

    let { t_name, pid, action } = event;

    pid = Number(pid); // Convert pid to number

    console.log("Extracted Parameters:");
    console.log("t_name:", t_name);
    console.log("pid:", pid);
    console.log("action:", action);

    if (!t_name || !pid || !action) throw new Error("Missing parameters.");

    const db = admin.firestore();

    if (action === "accept") {
      const userRef = db.collection("userData");
      const snapshot = await userRef.where("pid", "==", pid).get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        await userRef.doc(userDoc.id).update({ t_name });

        // const teamRef = db.collection(t_name);
        // await teamRef.add({
        //   pid: userData.pid,
        //   email: userData.email,
        //   firstName: userData.firstName,
        //   role: 'member',
        // });

        const teamsCollection = db.collection("teams");
        const teamDocument = teamsCollection.doc(t_name);
        await teamDocument.update({
          team_members: admin.firestore.FieldValue.arrayUnion({
            pid: userData.pid,
            firstName: userData.firstName,
            email: userData.email,
            role: "member",
          }),
        });

        const reqRef = db.collection("p_req");
        const reqSnapshot = await reqRef.where("t_name", "==", t_name).get();

        if (!reqSnapshot.empty) {
          const batch = db.batch();
          reqSnapshot.forEach((doc) => {
            batch.update(doc.ref, { status: action });
          });
          await batch.commit();
          console.log(
            `Successfully updated p_req collection status to ${action} in Firestore.`
          );
        }

        console.log(
          `Successfully updated user with pid ${pid} and added to the team ${t_name} in Firestore.`
        );
      } else {
        console.log(`No user found with pid ${pid}.`);
      }
    } else if (action === "reject") {
      const reqRef = db.collection("p_req");
      const snapshot = await reqRef.where("t_name", "==", t_name).get();
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.forEach((doc) => {
          batch.update(doc.ref, { status: "reject" });
        });
        await batch.commit();
        console.log(`Successfully updated p_req collection in Firestore.`);
      }
    }

    let message;
    if (action === "accept") {
      message = "Joined the team successfully.";
    } else if (action === "reject") {
      message = "Rejected the team request.";
    } else {
      message = "Invalid action.";
    }

    return {
      statusCode: 200,
      body: JSON.stringify(message),
    };
  } catch (error) {
    console.error("Error processing event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error processing event and Lambda invocation."),
    };
  }
};
