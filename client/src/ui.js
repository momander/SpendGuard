import { createRequest, getRequests, updateRequestStatus, getUserProfile, deleteAllRequests } from './api.js';
import { signOut } from './auth.js';

let currentUser = null;

export async function setupDashboard(user) {
    currentUser = user; // This is the Firebase user
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('logout-btn').addEventListener('click', signOut);

    const requestForm = document.getElementById('request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', handleCreateRequest);
    }

    // Event delegation for manager actions
    const approvalsTable = document.getElementById('approvals-body');
    if (approvalsTable) {
        approvalsTable.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const id = btn.dataset.id;
            if (!id) return;

            if (btn.classList.contains('btn-approve')) {
                await approveRequest(id);
            } else if (btn.classList.contains('btn-reject')) {
                await rejectRequest(id);
            }
        });
    }

    try {
        // Fetch full profile to get role
        const profile = await getUserProfile();

        const managerSection = document.getElementById('manager-section');
        if (managerSection) {
            if (profile.role === 'manager') {
                managerSection.style.display = 'block';
            } else {
                managerSection.style.display = 'none';
            }
        }
    } catch (err) {
        console.error("Failed to fetch profile:", err);
    }

    loadRequests();

    const btnDeleteAll = document.getElementById('btn-delete-all');
    if (btnDeleteAll) {
        btnDeleteAll.addEventListener('click', handleDeleteAll);
    }
}

async function handleCreateRequest(e) {
    e.preventDefault();
    const description = document.getElementById('desc').value;
    const amount = document.getElementById('amount').value;

    try {
        await createRequest({ description, amount });
        document.getElementById('request-form').reset();
        loadRequests(); // Reload list
        alert('Request created successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to create request: ' + error.message);
    }
}

async function loadRequests() {
    try {
        const requests = await getRequests();

        const user = currentUser;
        const currentUserUid = user ? user.uid : null;

        const myRequests = requests.filter(r => r.uid === currentUserUid);
        renderPersonalHistory(myRequests);

        const pendingRequests = requests.filter(r => r.status === 'PENDING');
        renderPendingApprovals(pendingRequests);

    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

function renderPersonalHistory(requests) {
    const tbody = document.getElementById('history-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    requests.forEach(r => {
        const tr = document.createElement('tr');
        const dateStr = r.createdAt ? timeAgo(r.createdAt) : 'N/A';

        tr.innerHTML = `
      <td>${dateStr}</td>
      <td>${r.description}</td>
      <td>$${r.amount}</td>
      <td>${r.status}</td>
    `;
        tbody.appendChild(tr);
    });
}

function renderPendingApprovals(requests) {
    const tbody = document.getElementById('approvals-body');

    if (!tbody) return;

    tbody.innerHTML = '';
    requests.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${r.email}</td>
      <td>${r.description}</td>
      <td>$${r.amount}</td>
      <td>
        <button class="btn-approve" data-id="${r.id}">Approve</button>
        <button class="btn-reject" data-id="${r.id}">Reject</button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    // Remove existing listener to prevent duplicates if any (though currently we just clear innerHTML)
    // Better: Add the listener once in setupDashboard, or just check if it's already there?
    // Since we re-render the whole table, the buttons are new.
    // But the container is static. So we should attach the listener to the container ONCE in setupDashboard.
}

// NOTE: We moved the event listeners to setupDashboard to use delegation.
// Removing global window functions.

async function approveRequest(id) {
    if (!confirm('Approve this request?')) return;
    try {
        await updateRequestStatus(id, 'APPROVED');
        loadRequests();
    } catch (e) {
        alert(e.message);
    }
}

async function rejectRequest(id) {
    if (!confirm('Reject this request?')) return;
    try {
        await updateRequestStatus(id, 'REJECTED');
        loadRequests();
    } catch (e) {
        alert(e.message);
    }
}

export { approveRequest, rejectRequest }; // Export for testing if needed

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval === 1 ? "yesterday" : interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " minutes ago";
    }
    return "just now";
}

async function handleDeleteAll() {
    const msg = 'Are you sure you want to delete all requests? This action cannot be undone.';
    if (!confirm(msg)) return;
    try {
        await deleteAllRequests();
        alert('All requests deleted successfully!');
        loadRequests();
    } catch (e) {
        alert(e.message);
    }
}
