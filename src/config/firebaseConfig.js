// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Suas chaves oficiais do LifeAccess
const firebaseConfig = {
  apiKey: "AIzaSyC6UXXVIyeZcgGXl5uBUjGT3aqcCkM52Wk",
  authDomain: "lifeaccessapp-353.firebaseapp.com",
  projectId: "lifeaccessapp-353",
  storageBucket: "lifeaccessapp-353.firebasestorage.app",
  messagingSenderId: "982775429805",
  appId: "1:982775429805:web:2db326450f44e08d4ea424",
  measurementId: "G-8S4KSE55Q5"
};

// Inicializa o aplicativo do Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Analytics (opcional, mas bom ter já que você ativou)
export const analytics = getAnalytics(app);

// Exporta as ferramentas que o LifeAccess vai usar
export const auth = getAuth(app);
export const dbFirestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Força o pop-up do Google a sempre pedir para escolher a conta
// (Isso é ótimo para testes e para usuários que dividem o dispositivo)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});