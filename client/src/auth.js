export function signIn(role) {
    localStorage.setItem('mockToken', role);
    console.log('User signed in as:', role);
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        window.location.href = 'dashboard.html';
    }
}

export function signOut() {
    localStorage.removeItem('mockToken');
    window.location.href = 'index.html';
}

export function onAuthStateChanged(callback) {
    // Check local storage for mock token
    const token = localStorage.getItem('mockToken');
    if (token) {
        callback({
            uid: token === 'admin' ? 'admin_uid' : 'user_uid',
            email: token === 'admin' ? 'admin@example.com' : 'user@example.com',
            role: token
        });
    } else {
        callback(null);
    }
}

export async function getToken() {
    return localStorage.getItem('mockToken');
}
