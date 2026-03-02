import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase-admin', () => {
    const firestoreDb = { collection: () => { } };
    return {
        default: {
            apps: [],
            initializeApp: () => { },
            credential: { applicationDefault: () => { } },
            firestore: () => firestoreDb
        },
        apps: [],
        initializeApp: () => { },
        credential: { applicationDefault: () => { } },
        firestore: () => firestoreDb
    };
});

import app from '../src/app';
import { db } from '../src/firestore';

describe('Express API Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        db.collection = vi.fn();
    });
    describe('GET /api/user/me', () => {
        it('returns user profile for valid token', async () => {
            const res = await request(app)
                .get('/api/user/me')
                .set('Authorization', 'Bearer user-123');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                uid: '123',
                email: 'user@example.com',
                role: 'employee'
            });
        });
        it('returns 401 if no token provided', async () => {
            const res = await request(app).get('/api/user/me');
            expect(res.status).toBe(401);
        });
    });
    describe('POST /api/requests', () => {
        it('creates a new request successfully', async () => {
            const mockAdd = vi.fn().mockResolvedValue({ id: 'req_1' });
            db.collection.mockReturnValue({ add: mockAdd });
            const res = await request(app)
                .post('/api/requests')
                .set('Authorization', 'Bearer user-123')
                .send({ amount: 100, description: 'Travel' });
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: 'req_1', status: 'PENDING' });
            expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
                uid: '123',
                amount: 100,
                description: 'Travel',
                status: 'PENDING'
            }));
        });
        it('returns 400 for invalid amount', async () => {
            const res = await request(app)
                .post('/api/requests')
                .set('Authorization', 'Bearer user-123')
                .send({ amount: -50, description: 'Travel' });
            expect(res.status).toBe(400);
        });
    });
    describe('GET /api/requests', () => {
        it('returns requests for employee', async () => {
            const mockDoc = { id: 'req_1', data: () => ({ amount: 100, createdAt: '2023-01-01T00:00:00Z' }) };
            const mockGet = vi.fn().mockResolvedValue([mockDoc]);
            const mockWhere = vi.fn().mockReturnValue({ get: mockGet });
            db.collection.mockReturnValue({ where: mockWhere });
            const res = await request(app)
                .get('/api/requests')
                .set('Authorization', 'Bearer user-123');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 'req_1', amount: 100, createdAt: '2023-01-01T00:00:00Z' }]);
            expect(mockWhere).toHaveBeenCalledWith('uid', '==', '123');
        });
        it('returns all requests for manager', async () => {
            const mockDoc = { id: 'req_1', data: () => ({ amount: 100, createdAt: '2023-01-01T00:00:00Z' }) };
            const mockGet = vi.fn().mockResolvedValue([mockDoc]);
            const mockOrder = vi.fn().mockReturnValue({ get: mockGet });
            db.collection.mockReturnValue({ orderBy: mockOrder });
            const res = await request(app)
                .get('/api/requests')
                .set('Authorization', 'Bearer admin-456');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 'req_1', amount: 100, createdAt: '2023-01-01T00:00:00Z' }]);
            expect(mockOrder).toHaveBeenCalledWith('createdAt', 'desc');
        });
    });
    describe('PATCH /api/requests/:id', () => {
        it('updates status if user is manager', async () => {
            const mockUpdate = vi.fn().mockResolvedValue({});
            db.collection.mockReturnValue({ doc: vi.fn().mockReturnValue({ update: mockUpdate }) });
            const res = await request(app)
                .patch('/api/requests/req_1')
                .set('Authorization', 'Bearer admin-456')
                .send({ status: 'APPROVED' });
            expect(res.status).toBe(200);
            expect(mockUpdate).toHaveBeenCalledWith({ status: 'APPROVED' });
        });
        it('returns 403 if user is not manager', async () => {
            const res = await request(app)
                .patch('/api/requests/req_1')
                .set('Authorization', 'Bearer user-123')
                .send({ status: 'APPROVED' });
            expect(res.status).toBe(403);
        });
    });
    describe('DELETE /api/requests/all', () => {
        it('deletes all requests if user is manager', async () => {
            const mockDoc1 = { ref: 'ref1' };
            const mockDoc2 = { ref: 'ref2' };
            const mockGet = vi.fn().mockResolvedValue({ docs: [mockDoc1, mockDoc2] });
            const mockBatchDelete = vi.fn();
            const mockBatchCommit = vi.fn().mockResolvedValue();

            db.collection.mockReturnValue({ get: mockGet });
            db.batch = vi.fn().mockReturnValue({
                delete: mockBatchDelete,
                commit: mockBatchCommit
            });

            const res = await request(app)
                .delete('/api/requests/all')
                .set('Authorization', 'Bearer admin-456');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'All requests deleted successfully' });
            expect(mockBatchDelete).toHaveBeenCalledTimes(2);
            expect(mockBatchDelete).toHaveBeenCalledWith('ref1');
            expect(mockBatchDelete).toHaveBeenCalledWith('ref2');
            expect(mockBatchCommit).toHaveBeenCalled();
        });

        it('returns 403 if user is not manager', async () => {
            const res = await request(app)
                .delete('/api/requests/all')
                .set('Authorization', 'Bearer user-123');
            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: 'Forbidden: Managers only' });
        });
    });
});
