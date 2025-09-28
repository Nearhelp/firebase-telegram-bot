import admin from "firebase-admin";
import axios from "axios";
import { readFileSync } from "fs";

// ✅ Firebase Service Account Key load
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

// ✅ Firebase Initialize
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nearhelp-bef33-default-rtdb.firebaseio.com" // ✅ Aapka database URL
});

// ✅ Yahan apna Telegram bot ka details daalein
const botToken = "7792799570:AAH3n-Ms2tPcOofnsCra9_IGmVMwxUqYyN0"; // <-- Apna BotFather se mila token daalein
const chatId = "-3137897795";              // <-- Apna chat ID daalein

// ✅ Firebase Realtime Database Path
const db = admin.database();
const ref = db.ref("/19112024/All_User"); // <-- Apna exact data path confirm karein

console.log("✅ Listening for new data from Firebase...");

// ✅ Event listener: naya data aate hi chalega
ref.on("child_added", async (snapshot) => {
  const data = snapshot.val();
  const message = `📢 New Data Received:\n${JSON.stringify(data, null, 2)}`;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message
    });
    console.log("✅ Data sent to Telegram:", data);
  } catch (error) {
    console.error("❌ Error sending to Telegram:", error.message);
  }
});