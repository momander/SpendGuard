const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db } = require('./firestore');
const verifyToken = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
// Apply auth middleware to all /api routes
app.use('/api', verifyToken);
// Get current user profile
app.get('/api/user/me', async (req, res) => {
    try {
        res.json({
            uid: req.user.uid,
            email: req.user.email,
            role: req.user.role
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Create a new request
app.post('/api/requests', async (req, res) => {
    try {
        const { amount, description } = req.body;
        const uid = req.user.uid;
        const email = req.user.email;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        let status = 'PENDING';
        const docRef = await db.collection('requests').add({
            uid,
            email,
            amount: parseFloat(amount),
            description,
            status,
            createdAt: new Date().toISOString()
        });
        res.status(201).json({ id: docRef.id, status });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Get requests
app.get('/api/requests', async (req, res) => {
    try {
        const uid = req.user.uid;
        const role = req.user.role;
        let snapshot;
        if (role === 'manager') {
            snapshot = await db.collection('requests').orderBy('createdAt', 'desc').get();
        } else {
            snapshot = await db.collection('requests').where('uid', '==', uid).get();
        }
        const requests = [];
        snapshot.forEach(doc => {
            requests.push({ id: doc.id, ...doc.data() });
        });
        if (role !== 'manager') {
            requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Update request status (Manager only)
app.patch('/api/requests/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const requestId = req.params.id;
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const role = req.user.role;
        if (role !== 'manager') {
            return res.status(403).json({ error: 'Forbidden: Managers only' });
        }
        await db.collection('requests').doc(requestId).update({ status });
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT} (Auto-reload works!)`);
    });
}
module.exports = app;
