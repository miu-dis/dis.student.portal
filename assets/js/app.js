// CDN থেকে ফায়ারবেস মডিউলগুলো ইম্পোর্ট করা হচ্ছে (ব্রাউজারে সরাসরি চালানোর জন্য)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// আপনার আসল ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyBkWJq71jzI5s3GJL9s4Ocegj61UbKZS7M",
  authDomain: "dis-student-portal.firebaseapp.com",
  projectId: "dis-student-portal",
  storageBucket: "dis-student-portal.firebasestorage.app",
  messagingSenderId: "24149905506",
  appId: "1:24149905506:web:1f69a8396aa3eac759c13b"
};

// ফায়ারবেস চালু করা হলো
const app = initializeApp(firebaseConfig);

// অন্যান্য ফাইলে ব্যবহারের জন্য এক্সপোর্ট করা হলো
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("Firebase Engine Connected!");
