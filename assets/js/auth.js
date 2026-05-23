import { auth, db } from "./app.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const msgs = {
    en: { uidExist: "Sorry! This University ID (UID) is already registered.", successReg: "Registration Successful! Welcome.", failLog: "Login Failed! Please check email or password." },
    ar: { uidExist: "عذرًا! هذا الرقم الجامعي مسجل بالفعل.", successReg: "تم التسجيل بنجاح! مرحبًا بك.", failLog: "فشل تسجيل الدخول! يرجى التحقق من البريد الإلكتروني أو كلمة المرور." },
    bn: { uidExist: "দুঃখিত! এই ইউনিভার্সিটি আইডি (UID) দিয়ে ইতিপূর্বেই অ্যাকাউন্ট তৈরি করা হয়েছে।", successReg: "নিবন্ধন সফল হয়েছে! স্বাগতম।", failLog: "লগইন ব্যর্থ হয়েছে! ইমেইল বা পাসওয়ার্ড চেক করুন।" }
};

const curLang = localStorage.getItem('preferredLang') || 'en';

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const uidInput = document.getElementById('regUID').value.trim();
        const batchNum = document.getElementById('regBatchNum').value.trim();
        const semester = document.getElementById('regSemester').value;
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;

        try {
            const q = query(collection(db, "users"), where("universityUID", "==", uidInput));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert(msgs[curLang].uidExist);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                universityUID: uidInput,
                batchNumber: batchNum,
                semester: semester,
                email: email,
                role: "student"
            });

            alert(msgs[curLang].successReg);
            window.location.href = "index.html";
        } catch (error) {
            alert(error.message);
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "index.html";
        } catch (error) {
            alert(msgs[curLang].failLog);
        }
    });
}