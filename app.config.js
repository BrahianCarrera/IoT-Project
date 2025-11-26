import 'dotenv/config';

export default ({ config }) => {
  // 1. Definimos una variable segura para 'extra'
  // Si config.extra no existe (es undefined), usamos un objeto vacío {}
  const existingExtra = config.extra || {};

  return {
    // Heredamos la configuración base
    ...config,

    // 2. Configuración Explícita (lo que tenías en app.json)
    name: "Mi Cultivo",
    slug: "iotProject",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "iotproject",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    entryPoint: "./src/app/index.tsx",
    
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.chensoxo.iotProject"
    },
    
    android: {
      package: "com.chensoxo.iotProject",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#E5E5E5"
      },
      edgeToEdgeEnabled: true
    },
    
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#E5E5E5",
          "image": "./assets/images/splash-icon-light.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "dark": {
            "image": "./assets/images/splash-icon-dark.png",
            "backgroundColor": "#151718"
          }
        }
      ]
    ],
    
    experiments: {
      typedRoutes: true
    },

    // 3. Objeto 'extra' con Variables de Entorno y Configuración Segura
    extra: {
      // Esparcimos la configuración extra existente de forma segura
      ...existingExtra,

      // --- Variables de Entorno (Firebase) ---
      APIKEY: process.env.APIKEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      DATABASEURL: process.env.DATABASEURL,
      EMAIL: process.env.EMAIL,
      PASSWORD: process.env.PASSWORD,
      PROJECTID: process.env.PROJECTID,
      STORAGEBUCKET: process.env.STORAGEBUCKET,
      MESSAGINGSENDERID: process.env.MESSAGINGSENDERID,
      APPID: process.env.APPID,
      MEASUREMENTID: process.env.MEASUREMENTID,

      // --- Configuración de Router (Corrección del error) ---
      router: {
        // Usamos 'existingExtra.router' solo si existe, si no, objeto vacío
        ...(existingExtra.router || {}),
      },

      // --- Configuración de EAS ---
      eas: {
        ...(existingExtra.eas || {}), // Mantiene config previa de EAS si existe
        projectId: "4b9ee389-b615-4ac0-a4f8-788ff186810b"
      }
    }
  };
};