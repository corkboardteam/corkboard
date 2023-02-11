
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
console.log('running')


const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
};

console.log(firebaseConfig)

//initialize firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(db)

async function getDB(db) {
    const test = collection(db, 'test')
    const obj = await getDocs(test)

    console.log(obj)
    obj.forEach((obs) => {
        console.log(obs.data())
    })
}

getDB(db)
export default db;