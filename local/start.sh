#!/bin/bash
# FastFix CRM Local Development Startup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting FastFix CRM Local Development Environment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start PostgreSQL
echo -e "${YELLOW}📦 Starting PostgreSQL...${NC}"
if docker ps -a | grep -q fastfix-postgres; then
    docker start fastfix-postgres > /dev/null 2>&1 || true
else
    docker run -d \
        --name fastfix-postgres \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=fastfix \
        -p 5432:5432 \
        postgres:15-alpine > /dev/null
fi

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
for i in {1..30}; do
    if docker exec fastfix-postgres pg_isready -U postgres > /dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Apply schema (only if tables don't exist)
if ! docker exec fastfix-postgres psql -U postgres -d fastfix -c "SELECT 1 FROM leads LIMIT 1" > /dev/null 2>&1; then
    echo -e "${YELLOW}📋 Applying database schema...${NC}"
    docker exec -i fastfix-postgres psql -U postgres -d fastfix < "$SCRIPT_DIR/schema.sql" > /dev/null 2>&1
fi

echo -e "${GREEN}✅ PostgreSQL running on localhost:5432${NC}"

# Kill existing processes
pkill -f "postgrest.*postgrest.conf" 2>/dev/null || true
pkill -f "node.*proxy.cjs" 2>/dev/null || true
sleep 1

# Start PostgREST
echo -e "${YELLOW}🔌 Starting PostgREST...${NC}"
postgrest "$SCRIPT_DIR/postgrest.conf" > /tmp/postgrest.log 2>&1 &
sleep 2

if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgREST running on localhost:3000${NC}"
else
    echo -e "${RED}❌ PostgREST failed to start. Check /tmp/postgrest.log${NC}"
    exit 1
fi

# Start Proxy
echo -e "${YELLOW}🌐 Starting Supabase-compatible proxy...${NC}"
node "$SCRIPT_DIR/proxy.cjs" > /tmp/proxy.log 2>&1 &
sleep 2

if curl -s http://localhost:54321/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Proxy running on localhost:54321${NC}"
else
    echo -e "${RED}❌ Proxy failed to start. Check /tmp/proxy.log${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  FastFix Local Development Environment Ready!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "  Services:"
echo "    • PostgreSQL:  localhost:5432 (user: postgres, pass: postgres)"
echo "    • PostgREST:   localhost:3000"
echo "    • API Proxy:   localhost:54321 (Supabase-compatible)"
echo ""
echo "  Test the API:"
echo "    curl http://localhost:54321/rest/v1/leads"
echo "    curl http://localhost:54321/auth/v1/user"
echo ""
echo "  Start the frontend:"
echo "    npm run dev"
echo ""
echo "  Frontend URL:"
echo "    http://localhost:8080"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait and cleanup on exit
trap 'echo ""; echo "Stopping services..."; pkill -f "postgrest.*postgrest.conf" 2>/dev/null; pkill -f "node.*proxy.cjs" 2>/dev/null; echo "Done."' EXIT

# Keep script running
wait
