import { describe, it, expect } from 'vitest';
import type { NextApiResponse } from 'next';
import { sendError, sendSuccess, ERROR_CODES } from '../api-utils';

/**
 * Minimal NextApiResponse stand-in that records what the handler did.
 */
function mockRes() {
  const state = {
    headers: {} as Record<string, string>,
    statusCode: 200,
    body: undefined as unknown,
  };
  const res = {
    setHeader(key: string, value: string) {
      state.headers[key] = value;
    },
    status(code: number) {
      state.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      state.body = payload;
      return res;
    },
  } as unknown as NextApiResponse;
  return { res, state };
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

describe('sendError', () => {
  it('returns the standard error envelope with the given status', () => {
    const { res, state } = mockRes();
    sendError(res, 404, { code: ERROR_CODES.NOT_FOUND, message: 'Missing' });

    expect(state.statusCode).toBe(404);
    expect(state.body).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Missing' },
    });
  });

  it('sets all security headers', () => {
    const { res, state } = mockRes();
    sendError(res, 400, { code: ERROR_CODES.BAD_REQUEST, message: 'Bad' });
    expect(state.headers).toMatchObject(SECURITY_HEADERS);
  });

  it('includes optional data when provided', () => {
    const { res, state } = mockRes();
    sendError(res, 422, { code: ERROR_CODES.VALIDATION_ERROR, message: 'Invalid' }, [
      { path: 'title' },
    ]);
    expect(state.body).toMatchObject({
      success: false,
      data: [{ path: 'title' }],
    });
  });

  it('throws if the error object is malformed (runtime schema validation)', () => {
    const { res } = mockRes();
    // Missing message → ErrorResponseSchema.parse should throw
    expect(() => sendError(res, 500, { code: 'X' } as never)).toThrow();
  });
});

describe('sendSuccess', () => {
  it('returns the standard success envelope', () => {
    const { res, state } = mockRes();
    sendSuccess(res, { id: 1 });
    expect(state.body).toEqual({ success: true, data: { id: 1 } });
  });

  it('includes an optional message', () => {
    const { res, state } = mockRes();
    sendSuccess(res, [], 'done');
    expect(state.body).toEqual({ success: true, data: [], message: 'done' });
  });

  it('sets all security headers', () => {
    const { res, state } = mockRes();
    sendSuccess(res, {});
    expect(state.headers).toMatchObject(SECURITY_HEADERS);
  });
});

describe('ERROR_CODES', () => {
  it('exposes a stable set of codes', () => {
    expect(ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED');
    expect(ERROR_CODES.METHOD_NOT_ALLOWED).toBe('METHOD_NOT_ALLOWED');
    expect(Object.values(ERROR_CODES)).toContain('INTERNAL_ERROR');
  });
});
