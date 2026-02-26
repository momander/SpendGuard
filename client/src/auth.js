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
        const parts = token.split('-');
        const role = parts[0];
        const id = parts[1] || (role === 'admin' ? 'admin_uid' : 'user_uid');
        callback({
            uid: id,
            email: role === 'admin' ? 'admin@example.com' : 'user@example.com',
            role: role
        });
    } else {
        callback(null);
    }
}

export async function getToken() {
    return localStorage.getItem('mockToken');
}
