import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiLogging } from '../with-logging';

vi.mock('../logger', () => ({
  default: { info: vi.fn() },
}));

import logger from '../logger';

function mockReqRes() {
  const req = { method: 'GET', url: '/api/test' } as unknown as NextApiRequest;
  const res = new EventEmitter() as unknown as NextApiResponse & EventEmitter;
  (res as unknown as { statusCode: number }).statusCode = 200;
  return { req, res };
}

describe('withApiLogging', () => {
  it('calls the wrapped handler and logs once on finish', async () => {
    const handler = vi.fn(async () => {});
    const wrapped = withApiLogging(handler, 'test');
    const { req, res } = mockReqRes();

    await wrapped(req, res);
    expect(handler).toHaveBeenCalledOnce();
    expect(logger.info).not.toHaveBeenCalled(); // nothing logged until finish

    (res as unknown as EventEmitter).emit('finish');
    expect(logger.info).toHaveBeenCalledOnce();
    const [fields, msg] = (logger.info as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(msg).toBe('api request');
    expect(fields).toMatchObject({ route: 'test', method: 'GET', status: 200 });
    expect(typeof fields.durationMs).toBe('number');
  });

  it('records the final status code (e.g. an error response)', async () => {
    const handler = vi.fn(async (_req: unknown, res: { statusCode: number }) => {
      res.statusCode = 429;
    });
    const wrapped = withApiLogging(handler);
    const { req, res } = mockReqRes();

    await wrapped(req, res);
    (res as unknown as EventEmitter).emit('finish');
    const [fields] = (logger.info as unknown as ReturnType<typeof vi.fn>).mock.calls.at(
      -1
    )!;
    expect(fields.status).toBe(429);
    expect(fields.route).toBe('/api/test'); // falls back to req.url
  });
});
