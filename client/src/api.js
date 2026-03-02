import { getToken } from './auth.js';

const API_BASE_URL = 'http://localhost:3000/api';

async function authFetch(url, options = {}) {
    const token = await getToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

export async function createRequest(data) {
    return authFetch('/requests', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function getRequests() {
    return authFetch('/requests');
}

export async function updateRequestStatus(id, status) {
    return authFetch(`/requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
}

export async function getUserProfile() {
    return authFetch('/user/me');
}

export async function deleteAllRequests() {
    return authFetch('/requests/all', {
        method: 'DELETE'
    });
}
