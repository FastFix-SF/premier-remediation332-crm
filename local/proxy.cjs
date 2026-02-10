#!/usr/bin/env node
/**
 * Simple proxy to make PostgREST compatible with Supabase JS client
 * Routes:
 *   /rest/v1/* -> PostgREST at localhost:3000
 *   /auth/v1/* -> Mock auth responses
 *   /functions/v1/* -> Mock edge function responses
 */

const http = require('http');
const crypto = require('crypto');

const PROXY_PORT = 54321;
const POSTGREST_HOST = 'localhost';
const POSTGREST_PORT = 3000;

// CORS headers - explicitly list all allowed headers (including Supabase-specific ones)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, apikey, x-client-info, Prefer, Range, X-Upsert, accept-profile, content-profile, x-supabase-api-version',
  'Access-Control-Expose-Headers': 'Content-Range, Range, X-Total-Count, Preference-Applied',
  'Access-Control-Max-Age': '86400',
};

// Mock user for local development
const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@localhost.dev',
  phone: '+15550000000',
  role: 'authenticated',
  aud: 'authenticated',
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Dev Admin', role: 'owner' },
  created_at: new Date().toISOString(),
};

const MOCK_SESSION = {
  access_token: 'mock-access-token-for-local-dev',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  user: MOCK_USER,
};

// Set CORS headers on response
function setCorsHeaders(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

// Handle auth endpoints
function handleAuth(req, res, pathname) {
  res.setHeader('Content-Type', 'application/json');
  setCorsHeaders(res);

  // GET /auth/v1/user - Get current user
  if (pathname === '/auth/v1/user' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(MOCK_USER));
    return;
  }

  // POST /auth/v1/token - Sign in
  if (pathname === '/auth/v1/token' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify(MOCK_SESSION));
    return;
  }

  // POST /auth/v1/signup - Sign up
  if (pathname === '/auth/v1/signup' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ user: MOCK_USER, session: MOCK_SESSION }));
    return;
  }

  // POST /auth/v1/otp - Request OTP
  if (pathname === '/auth/v1/otp' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ message_id: 'mock-message-id' }));
    return;
  }

  // POST /auth/v1/verify - Verify OTP
  if (pathname === '/auth/v1/verify' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ user: MOCK_USER, session: MOCK_SESSION }));
    return;
  }

  // POST /auth/v1/logout - Sign out
  if (pathname === '/auth/v1/logout' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({}));
    return;
  }

  // Default: return empty success
  res.writeHead(200);
  res.end(JSON.stringify({}));
}

// Handle edge function endpoints (mock)
function handleFunctions(req, res, pathname) {
  res.setHeader('Content-Type', 'application/json');
  setCorsHeaders(res);

  // track-visitor - just acknowledge
  if (pathname.includes('track-visitor')) {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'Tracking disabled in local dev' }));
    return;
  }

  // Default: return success with message
  res.writeHead(200);
  res.end(JSON.stringify({
    success: true,
    message: 'Edge function mocked in local dev',
    function: pathname.replace('/functions/v1/', '')
  }));
}

// Proxy to PostgREST
function proxyToPostgrest(req, res, pathname) {
  // Remove /rest/v1 prefix
  const targetPath = pathname.replace('/rest/v1', '') || '/';
  const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';

  const options = {
    hostname: POSTGREST_HOST,
    port: POSTGREST_PORT,
    path: targetPath + (queryString ? '?' + queryString : ''),
    method: req.method,
    headers: {},
  };

  // Copy relevant headers, but clean up host
  const headersToForward = ['content-type', 'accept', 'prefer', 'range', 'accept-profile', 'content-profile'];
  headersToForward.forEach(header => {
    if (req.headers[header]) {
      options.headers[header] = req.headers[header];
    }
  });

  // Only forward Authorization if it's a valid JWT (has 3 parts separated by dots)
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    if (token.split('.').length === 3) {
      options.headers['authorization'] = authHeader;
    }
    // If not a valid JWT, don't forward it - PostgREST will use anon role
  }

  options.headers['host'] = `${POSTGREST_HOST}:${POSTGREST_PORT}`;

  const proxyReq = http.request(options, (proxyRes) => {
    // Set CORS headers first
    setCorsHeaders(res);

    // Copy response headers (but not CORS ones, we set our own)
    Object.keys(proxyRes.headers).forEach((key) => {
      if (!key.toLowerCase().startsWith('access-control')) {
        res.setHeader(key, proxyRes.headers[key]);
      }
    });

    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    setCorsHeaders(res);
    res.writeHead(502);
    res.end(JSON.stringify({ error: 'Bad Gateway', message: err.message }));
  });

  req.pipe(proxyReq);
}

// Main server
const server = http.createServer((req, res) => {
  // Parse URL manually (avoid deprecated url.parse)
  const questionMark = req.url.indexOf('?');
  const pathname = questionMark > -1 ? req.url.substring(0, questionMark) : req.url;

  // Log request (skip OPTIONS for cleaner logs)
  if (req.method !== 'OPTIONS') {
    console.log(`${req.method} ${pathname}`);
  }

  // Handle CORS preflight for ALL routes
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // Route to appropriate handler
  if (pathname.startsWith('/auth/v1')) {
    handleAuth(req, res, pathname);
  } else if (pathname.startsWith('/functions/v1')) {
    handleFunctions(req, res, pathname);
  } else if (pathname.startsWith('/rest/v1')) {
    proxyToPostgrest(req, res, pathname);
  } else if (pathname === '/') {
    // Health check / root
    res.setHeader('Content-Type', 'application/json');
    setCorsHeaders(res);
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      message: 'FastFix Local Development Proxy',
      endpoints: {
        rest: '/rest/v1/*',
        auth: '/auth/v1/*',
        functions: '/functions/v1/*',
      },
    }));
  } else {
    // Unknown route - return 404
    setCorsHeaders(res);
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
  }
});

// Handle WebSocket upgrade for Supabase Realtime (mock)
server.on('upgrade', (req, socket, head) => {
  if (!req.url.startsWith('/realtime/')) {
    socket.destroy();
    return;
  }

  // Minimal WebSocket handshake
  const key = req.headers['sec-websocket-key'];
  const accept = crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-5AB5DC11CE56')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n` +
    '\r\n'
  );

  // Send a Phoenix-compatible heartbeat reply to keep connection alive
  socket.on('data', (data) => {
    try {
      // Decode WebSocket frame
      const secondByte = data[1];
      const masked = (secondByte & 0x80) !== 0;
      let payloadLen = secondByte & 0x7f;
      let offset = 2;
      if (payloadLen === 126) {
        payloadLen = data.readUInt16BE(2);
        offset = 4;
      }
      const maskKey = masked ? data.slice(offset, offset + 4) : null;
      if (masked) offset += 4;
      const payload = Buffer.alloc(payloadLen);
      for (let i = 0; i < payloadLen; i++) {
        payload[i] = masked ? data[offset + i] ^ maskKey[i % 4] : data[offset + i];
      }
      const msg = JSON.parse(payload.toString());

      // Reply to Phoenix heartbeat
      if (msg.event === 'heartbeat' || msg.topic === 'phoenix') {
        const reply = JSON.stringify({
          topic: msg.topic || 'phoenix',
          event: 'phx_reply',
          payload: { status: 'ok', response: {} },
          ref: msg.ref,
        });
        const replyBuf = Buffer.from(reply);
        const frame = Buffer.alloc(2 + replyBuf.length);
        frame[0] = 0x81; // text frame
        frame[1] = replyBuf.length;
        replyBuf.copy(frame, 2);
        socket.write(frame);
      }

      // Reply to phx_join with ok
      if (msg.event === 'phx_join') {
        const reply = JSON.stringify({
          topic: msg.topic,
          event: 'phx_reply',
          payload: { status: 'ok', response: {} },
          ref: msg.ref,
        });
        const replyBuf = Buffer.from(reply);
        const frame = Buffer.alloc(2 + replyBuf.length);
        frame[0] = 0x81;
        frame[1] = replyBuf.length;
        replyBuf.copy(frame, 2);
        socket.write(frame);
      }
    } catch (e) {
      // Ignore parse errors for binary frames, pings, etc.
    }
  });

  socket.on('error', () => {});
  console.log('WS Realtime connected (mocked)');
});

server.listen(PROXY_PORT, () => {
  console.log(`\n🚀 FastFix Local Proxy running on http://localhost:${PROXY_PORT}`);
  console.log(`   • REST API: http://localhost:${PROXY_PORT}/rest/v1/* → PostgREST:${POSTGREST_PORT}`);
  console.log(`   • Auth API: http://localhost:${PROXY_PORT}/auth/v1/* (mocked)`);
  console.log(`   • Functions: http://localhost:${PROXY_PORT}/functions/v1/* (mocked)`);
  console.log(`\nReady for requests!\n`);
});
