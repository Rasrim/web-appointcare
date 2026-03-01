#!/bin/bash
# Database initialization script for AppointCare

echo "🔧 Initializing AppointCare Database..."
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) is not installed"
    echo "Please install PostgreSQL and try again"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
fi

# Set default values if not in .env
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-appointcare}

echo "📦 Database Configuration:"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Create database if it doesn't exist
echo "1️⃣  Creating database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
echo "✅ Database created/verified"

# Run migrations in order
echo ""
echo "2️⃣  Running migrations..."

for migration in migrations/000_*.sql; do
    if [ -f "$migration" ]; then
        echo "   Running: $migration"
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "   ✅ $migration completed"
        else
            echo "   ⚠️  $migration had issues (may be OK if table already exists)"
        fi
    fi
done

for migration in migrations/00[1-9]*.sql; do
    if [ -f "$migration" ]; then
        echo "   Running: $migration"
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "   ✅ $migration completed"
        else
            echo "   ⚠️  $migration had issues (may be OK if table already exists)"
        fi
    fi
done

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "📊 Verifying tables..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

echo ""
echo "🚀 Database is ready for AppointCare!"
