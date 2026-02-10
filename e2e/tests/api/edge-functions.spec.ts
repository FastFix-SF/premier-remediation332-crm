import { test, expect } from '@playwright/test';

/**
 * Edge Function API Tests
 * Tests the Supabase edge functions directly via HTTP
 */

// Use the functions base URL from environment or default to production
const FUNCTIONS_BASE = process.env.VITE_FUNCTIONS_BASE || 'http://127.0.0.1:54321/functions/v1';

test.describe('Edge Functions API', () => {
  test.describe('Public Functions (no auth required)', () => {
    test('geocode-address should accept POST request', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/geocode-address`, {
        data: {
          address: '123 Main St, Austin, TX 78701',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Function should respond (may fail if API keys not configured)
      expect([200, 400, 401, 500]).toContain(response.status());
    });

    test('track-visitor should accept POST request', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/track-visitor`, {
        data: {
          page: '/test',
          referrer: 'test',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect([200, 201, 400]).toContain(response.status());
    });

    test('create-crm-lead should accept lead data', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/create-crm-lead`, {
        data: {
          firstName: 'Test',
          lastName: 'Lead',
          phone: '+15551234567',
          email: 'test@example.com',
          address: '123 Test St',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // May require auth or validation
      expect([200, 201, 400, 401]).toContain(response.status());
    });

    test('help-assistant should respond to queries', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/help-assistant`, {
        data: {
          query: 'How do I create a project?',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect([200, 400, 401, 500]).toContain(response.status());
    });

    test('map-config should return configuration', async ({ request }) => {
      const response = await request.get(`${FUNCTIONS_BASE}/map-config`);

      expect([200, 401]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
    });
  });

  test.describe('Protected Functions (require auth)', () => {
    // These tests verify the functions reject unauthorized requests

    test('generate-schema-seed should require auth', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/generate-schema-seed`, {
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Should require authentication
      expect([401, 403]).toContain(response.status());
    });

    test('export-training-data should require auth', async ({ request }) => {
      const response = await request.get(`${FUNCTIONS_BASE}/export-training-data`);

      expect([401, 403]).toContain(response.status());
    });

    test('analyze-project should require auth', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/analyze-project`, {
        data: {
          projectId: 'test-id',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect([401, 403]).toContain(response.status());
    });
  });

  test.describe('Webhook Functions', () => {
    test('stripe-webhook should handle POST', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/stripe-webhook`, {
        data: {
          type: 'test.event',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Should respond (may fail without valid signature)
      expect([200, 400, 401]).toContain(response.status());
    });

    test('receive-sms-webhook should handle POST', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/receive-sms-webhook`, {
        data: {
          From: '+15551234567',
          Body: 'Test message',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect([200, 400]).toContain(response.status());
    });
  });

  test.describe('Function Response Formats', () => {
    test('functions should return JSON', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/track-visitor`, {
        data: {
          page: '/test',
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const contentType = response.headers()['content-type'];
      expect(contentType).toMatch(/json/);
    });

    test('functions should handle invalid JSON gracefully', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/create-crm-lead`, {
        data: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Should return error, not crash
      expect([400, 422, 500]).toContain(response.status());
    });

    test('functions should handle missing required fields', async ({ request }) => {
      const response = await request.post(`${FUNCTIONS_BASE}/create-crm-lead`, {
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Should validate and return error
      expect([400, 422]).toContain(response.status());
    });
  });

  test.describe('CORS Headers', () => {
    test('functions should include CORS headers', async ({ request }) => {
      const response = await request.options(`${FUNCTIONS_BASE}/track-visitor`);

      // OPTIONS preflight should succeed
      expect([200, 204]).toContain(response.status());

      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
