#!/bin/bash

echo "========================================"
echo "CoreDNA-369 Full Stack Startup"
echo "========================================"

# Start backend
echo ""
echo "Starting Backend on port 3000..."
cd backend
npm run build > /dev/null 2>&1
node dist/src/index.js > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✓ Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 2

# Check backend health
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo "✓ Backend is healthy"
else
  echo "⚠ Backend may still be starting..."
fi

# Start frontend
echo ""
echo "Starting Frontend on port 1111..."
cd ..
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✓ Frontend PID: $FRONTEND_PID"

echo ""
echo "========================================"
echo "✓ CoreDNA-369 is LIVE"
echo "========================================"
echo ""
echo "Frontend:  http://localhost:1111"
echo "Backend:   http://localhost:3000"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "To stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

wait
