import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { APIKEY, DATABASEURL, authDomain } from '../.env';


const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: authDomain,
  databaseURL: DATABASEURL,
  projectId: "cultivo-hidro",
  storageBucket: "cultivo-hidro.firebasestorage.app",
  messagingSenderId: "155817802439",
  appId: "1:155817802439:web:6a4113a14bd34a574b9ce2",
  measurementId: "G-KKRMY0YJP8"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
