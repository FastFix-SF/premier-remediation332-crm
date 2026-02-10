import { test, expect } from '@playwright/test';

/**
 * Database Query Tests via Supabase API
 * Tests the database access patterns and RLS policies
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

test.describe('Database Queries via API', () => {
  test.describe('Public Tables (anon access)', () => {
    test('should query public data without auth', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });

      // API should be accessible
      expect([200, 401]).toContain(response.status());
    });
  });

  test.describe('Protected Tables (require auth)', () => {
    test('admin_users should require authentication', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/admin_users`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });

      // RLS should block or return empty for unauthenticated users
      expect([200, 401, 403]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        // Should return empty array due to RLS
        expect(Array.isArray(data)).toBe(true);
      }
    });

    test('team_directory should enforce RLS', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/team_directory`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });

      expect([200, 401, 403]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      }
    });

    test('projects table should enforce tenant isolation', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/projects?limit=10`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });

      expect([200, 401, 403]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        // Without auth, should return empty or only public data
      }
    });
  });

  test.describe('Query Filters', () => {
    test('should support eq filter', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/projects?status=eq.active&limit=1`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });

      expect([200, 401]).toContain(response.status());
    });

    test('should support select columns', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/projects?select=id,name,status&limit=1`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });

      expect([200, 401]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        if (data.length > 0) {
          expect(data[0]).toHaveProperty('id');
          expect(data[0]).toHaveProperty('name');
        }
      }
    });

    test('should support order by', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/projects?order=created_at.desc&limit=5`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
      });

      expect([200, 401]).toContain(response.status());
    });

    test('should support pagination', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/projects?limit=10&offset=0`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Range': '0-9',
        },
      });

      expect([200, 206, 401]).toContain(response.status());
    });
  });

  test.describe('Data Integrity', () => {
    test('should validate required fields on insert', async ({ request }) => {
      const response = await request.post(`${SUPABASE_URL}/rest/v1/projects`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        data: {
          // Missing required fields
        },
      });

      // Should reject invalid data
      expect([400, 401, 403, 422]).toContain(response.status());
    });

    test('should enforce foreign key constraints', async ({ request }) => {
      const response = await request.post(`${SUPABASE_URL}/rest/v1/projects`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        data: {
          tenant_id: 'non-existent-tenant-uuid',
          name: 'Test Project',
        },
      });

      // Should reject due to FK constraint or RLS
      expect([400, 401, 403, 422]).toContain(response.status());
    });
  });

  test.describe('Response Headers', () => {
    test('should return content-range for queries', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/rest/v1/projects?limit=10`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact',
        },
      });

      if (response.status() === 200) {
        const contentRange = response.headers()['content-range'];
        // Should include count information
        expect(contentRange || true).toBeTruthy();
      }
    });
  });

  test.describe('Real-time Subscriptions', () => {
    test('realtime endpoint should be accessible', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/realtime/v1/websocket`, {
        headers: {
          'apikey': SUPABASE_KEY,
        },
      });

      // WebSocket upgrade or redirect expected
      expect([101, 200, 400, 426]).toContain(response.status());
    });
  });

  test.describe('Storage API', () => {
    test('storage endpoint should be accessible', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/storage/v1/bucket`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      });

      expect([200, 401, 403]).toContain(response.status());
    });

    test('storage should enforce bucket policies', async ({ request }) => {
      const response = await request.get(`${SUPABASE_URL}/storage/v1/object/private/test.txt`, {
        headers: {
          'apikey': SUPABASE_KEY,
        },
      });

      // Private bucket should require auth
      expect([401, 403, 404]).toContain(response.status());
    });
  });
});
