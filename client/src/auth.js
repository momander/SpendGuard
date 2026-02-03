// Firebase Configuration (Replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyAS2G49EY5NtfE_eq3XOSQqJux49iY5gPI",
  authDomain: "spendguard-486219.firebaseapp.com",
  projectId: "spendguard-486219",
  storageBucket: "spendguard-486219.firebasestorage.app",
  messagingSenderId: "651399240515",
  appId: "1:651399240515:web:a4c790aeb96bc2a7596df6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export function signIn() {
    auth.signInWithPopup(provider)
        .then((result) => {
            // User signed in
            const user = result.user;
            console.log('User signed in:', user);
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                window.location.href = 'dashboard.html';
            }
        })
        .catch((error) => {
            console.error('Error signing in:', error);
            alert('Sign in failed: ' + error.message);
        });
}

export function signOut() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

export function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(callback);
}

export async function getToken() {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
}
