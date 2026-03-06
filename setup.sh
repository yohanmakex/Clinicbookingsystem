#!/bin/bash

echo "🚀 Setting up Skincare Clinic Appointment System..."

# Backend setup
echo "\n📦 Setting up backend..."
cd backend
cp .env.example .env
echo "✅ Created backend .env file"
echo "⚠️  Please edit backend/.env with your MongoDB URI and JWT secret"

# Frontend setup
echo "\n📦 Setting up frontend..."
cd ../frontend
cp .env.example .env
echo "✅ Created frontend .env file"

cd ..

echo "\n✨ Setup complete!"
echo "\nNext steps:"
echo "1. Edit backend/.env with your MongoDB connection string"
echo "2. Install dependencies:"
echo "   cd backend && npm install"
echo "   cd ../frontend && npm install"
echo "3. Seed the database:"
echo "   cd backend && node scripts/seed.js"
echo "4. Start the servers:"
echo "   Backend: cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
echo "\n5. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "\n6. Admin login credentials:"
echo "   Email: admin@clinic.com"
echo "   Password: admin123"
