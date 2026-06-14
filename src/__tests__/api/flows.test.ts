import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'node:events';

const { findOne, findOneAndUpdate, getServerSession } = vi.hoisted(() => ({
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/mongodb', () => ({ connectToDB: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/models', () => ({ FlowModel: { findOne, findOneAndUpdate } }));
vi.mock('next-auth/next', () => ({ getServerSession }));
vi.mock('@/pages/api/auth/[...nextauth]', () => ({ authOptions: {} }));

import handler from '@/pages/api/flows';

function mockReqRes(method: string, body: unknown = {}) {
  const req = {
    method,
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
  getServerSession.mockResolvedValue({ user: { email: 'owner@example.com' } });
});

describe('flows handler — optimistic concurrency', () => {
  it('GET returns the stored board with its updatedAt', async () => {
    findOne.mockResolvedValue({
      nodes: [1],
      edges: [2],
      updatedAt: '2026-06-14T00:00:00Z',
    });
    const { req, res } = mockReqRes('GET');
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({ updatedAt: '2026-06-14T00:00:00Z' });
  });

  it('saves when the client version matches the stored version', async () => {
    findOne.mockResolvedValue({ updatedAt: '2026-06-14T00:00:00Z' });
    findOneAndUpdate.mockResolvedValue({
      nodes: [],
      edges: [],
      updatedAt: '2026-06-14T00:01:00Z',
    });
    const { req, res } = mockReqRes('POST', {
      nodes: [],
      edges: [],
      baseUpdatedAt: '2026-06-14T00:00:00Z',
    });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(findOneAndUpdate).toHaveBeenCalledOnce();
    expect(res.body.data.updatedAt).toBe('2026-06-14T00:01:00Z');
  });

  it('rejects with 409 when the stored version is newer than the client base', async () => {
    findOne.mockResolvedValue({ updatedAt: '2026-06-14T00:05:00Z' }); // newer
    const { req, res } = mockReqRes('POST', {
      nodes: [],
      edges: [],
      baseUpdatedAt: '2026-06-14T00:00:00Z', // stale
    });
    await handler(req, res);
    expect(res.statusCode).toBe(409);
    expect(findOneAndUpdate).not.toHaveBeenCalled(); // never clobbers the newer board
    expect(res.body).toMatchObject({ success: false, error: { code: 'CONFLICT' } });
  });

  it('saves the first board (no existing doc, upsert)', async () => {
    findOne.mockResolvedValue(null);
    findOneAndUpdate.mockResolvedValue({ nodes: [], edges: [], updatedAt: 't' });
    const { req, res } = mockReqRes('POST', { nodes: [], edges: [] });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(findOneAndUpdate).toHaveBeenCalledOnce();
  });
});
