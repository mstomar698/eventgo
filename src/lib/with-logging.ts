import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import logger from './logger';

/**
 * Wraps a Next.js API handler so every request emits one structured log line with the
 * method, route, response status, and latency — without each handler having to log itself.
 *
 * The log fires on the response `finish` event, so the recorded status/latency reflect what
 * was actually sent, including errors. Per-route detail logs (e.g. AI cache hits) still live
 * in the handlers; this just guarantees a consistent baseline across every endpoint.
 */
export function withApiLogging(handler: NextApiHandler, route?: string): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();
    res.on('finish', () => {
      logger.info(
        {
          route: route ?? req.url ?? 'api',
          method: req.method,
          status: res.statusCode,
          durationMs: Date.now() - start,
        },
        'api request'
      );
    });
    return handler(req, res);
  };
}
