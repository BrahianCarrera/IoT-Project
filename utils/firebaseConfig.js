import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
// ❌ Ya no importamos desde '@env' ❌
import Constants from 'expo-constants'; // 👈 Importamos Constants

// 1. Obtener las variables del objeto 'extra'
const {
  APIKEY,
  AUTH_DOMAIN,
  DATABASEURL,
  EMAIL,
  PASSWORD,
  PROJECTID,
  STORAGEBUCKET,
  MESSAGINGSENDERID,
  APPID,
  MEASUREMENTID,
} = Constants.manifest?.extra || {}; // Desestructuración segura

// 2. Usar las variables en firebaseConfig

const firebaseConfig = {
  // Nota: TS podría quejarse de que estas pueden ser 'undefined',
  // deberías asegurar que no lo sean antes de inicializar la app.
  apiKey: APIKEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASEURL,
  projectId: PROJECTID,                  
  storageBucket: STORAGEBUCKET,          
  messagingSenderId: MESSAGINGSENDERID,  
  appId: APPID,                          
  measurementId: MEASUREMENTID           
};

// ... el resto del archivo es el mismo, usando EMAIL y PASSWORD que también vienen de extra ...

// 3. (Recomendado) Asegurar la existencia de las claves antes de initializeApp:
if (!APIKEY || !EMAIL) {
    console.error("FALTAN VARIABLES DE ENTORNO. Asegúrate de que .env esté cargado en app.config.js");
    
}

const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia de AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const database = getDatabase(app);
let currentUserId = null;

async function authenticateAndSetup() {
    try {
        console.log("Intentando autenticar el usuario...");
        
        // La autenticación es asíncrona
        const userCredential = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
        const user = userCredential.user;
        
        currentUserId = user.uid; // Guarda el UID
        console.log("✅ Usuario autenticado con éxito. UID:", currentUserId);
        
        // Opcional: Escribir un log de conexión
        await set(ref(database, 'logs/connection/' + currentUserId), {
            timestamp: new Date().toISOString(),
            status: 'Authenticated and Ready'
        });

    } catch (error) {
        console.error("❌ Error de Autenticación o Conexión a RTDB:", error.code, error.message);
        // Manejar el error (ej: mostrar un mensaje en la UI)
        // No lanzamos error aquí para no romper la app completa, pero logueamos
    }
}

// Inicia el proceso de autenticación inmediatamente
authenticateAndSetup();

// Exporta la instancia de la base de datos (Realtime Database)
export { authenticateAndSetup, currentUserId, database };
