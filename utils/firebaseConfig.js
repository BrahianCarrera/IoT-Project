import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyAMBLi6pqFIEx6uOP4wRgfZtVtM49DxDek",
  authDomain: "cultivo-hidro.firebaseapp.com",
  databaseURL: "https://cultivo-hidro-default-rtdb.firebaseio.com",
  projectId: "cultivo-hidro",
  storageBucket: "cultivo-hidro.firebasestorage.app",
  messagingSenderId: "155817802439",
  appId: "1:155817802439:web:6a4113a14bd34a574b9ce2",
  measurementId: "G-KKRMY0YJP8"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
