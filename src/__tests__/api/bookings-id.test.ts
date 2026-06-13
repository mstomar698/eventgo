import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'node:events';

// NOTE: this test lives under src/__tests__ (not src/pages/api) because Next.js treats any
// file under pages/api as a route and requires a default handler export at build time.
// vi.mock matches by resolved module id, so the @/-alias paths below intercept the same
// modules the handler imports via relative paths.

const { findById, findByIdAndUpdate, findByIdAndDelete, getServerSession } = vi.hoisted(
  () => ({
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    getServerSession: vi.fn(),
  })
);

vi.mock('@/lib/mongodb', () => ({ connectToDB: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/models/booking', () => ({
  Booking: { findById, findByIdAndUpdate, findByIdAndDelete },
}));
vi.mock('next-auth/next', () => ({ getServerSession }));
vi.mock('@/pages/api/auth/[...nextauth]', () => ({ authOptions: {} }));

import handler from '@/pages/api/bookings/[id]';

const OWNER = 'owner@example.com';
const OTHER = 'attacker@example.com';

function mockReqRes(method: string, id: string | undefined, body: unknown = {}) {
  const req = {
    method,
    query: { id },
    body,
    headers: { 'x-forwarded-for': '1.2.3.4' },
    socket: {},
  } as any;
  const res = new EventEmitter() as any;
  res.statusCode = 200;
  res.setHeader = vi.fn();
  res.status = vi.fn((c: number) => {
    res.statusCode = c;
    return res;
  });
  res.json = vi.fn((b: unknown) => {
    res.body = b;
    return res;
  });
  return { req, res };
}

beforeEach(() => {
  vi.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { email: OWNER } });
});

describe('bookings/[id] handler', () => {
  it('401 when unauthenticated', async () => {
    getServerSession.mockResolvedValue(null);
    const { req, res } = mockReqRes('PATCH', 'abc', { status: 'confirmed' });
    await handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(findById).not.toHaveBeenCalled();
  });

  it('400 on a missing/invalid id', async () => {
    const { req, res } = mockReqRes('PATCH', undefined, { status: 'confirmed' });
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('404 when the booking does not exist', async () => {
    findById.mockResolvedValue(null);
    const { req, res } = mockReqRes('DELETE', 'abc');
    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });

  it('403 when the booking belongs to another user (IDOR guard)', async () => {
    findById.mockResolvedValue({ _id: 'abc', createdBy: OTHER });
    const { req, res } = mockReqRes('DELETE', 'abc');
    await handler(req, res);
    expect(res.statusCode).toBe(403);
    expect(findByIdAndDelete).not.toHaveBeenCalled(); // never mutates another user's data
  });

  it('updates the booking for its owner (PATCH)', async () => {
    findById.mockResolvedValue({ _id: 'abc', createdBy: OWNER });
    findByIdAndUpdate.mockResolvedValue({ _id: 'abc', status: 'confirmed' });
    const { req, res } = mockReqRes('PATCH', 'abc', { status: 'confirmed' });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(findByIdAndUpdate).toHaveBeenCalledOnce();
    expect(res.body).toMatchObject({ success: true });
  });

  it('deletes the booking for its owner (DELETE)', async () => {
    findById.mockResolvedValue({ _id: 'abc', createdBy: OWNER });
    findByIdAndDelete.mockResolvedValue({ _id: 'abc' });
    const { req, res } = mockReqRes('DELETE', 'abc');
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(findByIdAndDelete).toHaveBeenCalledOnce();
  });

  it('405 on an unsupported method', async () => {
    findById.mockResolvedValue({ _id: 'abc', createdBy: OWNER });
    const { req, res } = mockReqRes('GET', 'abc');
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });
});
