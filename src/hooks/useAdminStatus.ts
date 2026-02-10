
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

// Get tenant ID from environment (set during deployment)
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

// DEV ONLY: Check if running on localhost
const isLocalDev = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const useAdminStatus = () => {
  const { user, loading: authLoading } = useAuth()

  return useQuery({
    queryKey: ['admin-status', user?.id, TENANT_ID],
    queryFn: async () => {
      // DEV ONLY: Check for mock dev session in localStorage
      if (isLocalDev) {
        const mockAdmin = localStorage.getItem('dev_mock_admin');
        const mockRole = localStorage.getItem('dev_mock_role');

        if (mockAdmin === 'true') {
          console.log('DEV MODE: Using mock admin session', { mockRole });
          return {
            isAdmin: true,
            isOwner: mockRole === 'owner',
            isLeader: mockRole === 'leader' || mockRole === 'owner',
            user: user || { id: 'dev-mock-user', email: 'admin@localhost.dev' }
          }
        }
      }

      if (!user) {
        return { isAdmin: false, isOwner: false, isLeader: false, user: null }
      }

      try {
        // Check if user is in admin_users table
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle()

        // Check if user is owner or admin in team_directory (including secondary_role)
        // Must filter by tenant_id for multi-tenant isolation
        let teamQuery = supabase
          .from('team_directory')
          .select('role, secondary_role, status')
          .eq('user_id', user.id)
          .eq('status', 'active')

        // Add tenant filter if available
        if (TENANT_ID) {
          teamQuery = teamQuery.eq('tenant_id', TENANT_ID)
        }

        const { data: teamMember } = await teamQuery.maybeSingle()

        // Check both primary and secondary roles for admin/owner/leader status
        const isAdmin = !!adminUser ||
                        teamMember?.role === 'admin' ||
                        teamMember?.secondary_role === 'admin'
        const isOwner = teamMember?.role === 'owner' ||
                        teamMember?.secondary_role === 'owner'
        const isLeader = teamMember?.role === 'leader' ||
                         teamMember?.secondary_role === 'leader'

        console.log('Admin status check:', {
          userId: user.id,
          phone: user.phone,
          isAdmin,
          isOwner,
          isLeader,
          teamRole: teamMember?.role,
          secondaryRole: teamMember?.secondary_role,
          hasAdminRecord: !!adminUser,
          result: isAdmin || isOwner
        })

        return {
          isAdmin: isAdmin || isOwner,
          isOwner,
          isLeader,
          user
        }
      } catch (error) {
        // DEV ONLY: If backend fails on localhost, allow mock admin
        if (isLocalDev) {
          console.warn('Backend unavailable, checking for dev mock session');
          const mockAdmin = localStorage.getItem('dev_mock_admin');
          if (mockAdmin === 'true') {
            return {
              isAdmin: true,
              isOwner: true,
              isLeader: true,
              user: user || { id: 'dev-mock-user', email: 'admin@localhost.dev' }
            }
          }
        }
        throw error;
      }
    },
    enabled: !authLoading && (!!user || (isLocalDev && localStorage.getItem('dev_mock_admin') === 'true')),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  })
}
