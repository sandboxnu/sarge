DB_USER="postgres"
DB_PASSWORD="password"
DB_NAME="sarge"

DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME

echo "Clearing existing data..."

PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -c "
    -- Clear all tables (in order to avoid foreign key constraints)
    TRUNCATE TABLE \"Comment\", \"Review\", \"Task\", \"Assessment\", \"TaskTemplate\", \"AssessmentTemplate\", \"CandidatePoolEntry\", \"Candidate\", \"Position\", \"Tag\", \"UserRole\", \"Role\", \"User\", \"Organization\" RESTART IDENTITY CASCADE;
"

echo "Seeding database with test data..."

PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -c "
    -- Step 1: Create Users first (without orgId)
    INSERT INTO \"User\" (id, name, email, \"createdAt\", \"updatedAt\")
    VALUES
        ('e99335bd-9dd7-4260-8977-2eeaa4df799c', 'Admin User', 'admin@techcorp.com', NOW(), NOW()),
        ('68992d1e-e119-4874-b768-bf685d10194e', 'John Doe', 'john.doe@techcorp.com', NOW(), NOW()),
        ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Jane Smith', 'jane.smith@startupxyz.com', NOW(), NOW()),
        ('b2c3d4e5-f6g7-8901-bcde-f12345678901', 'Bob Wilson', 'bob.wilson@enterprise.com', NOW(), NOW());

    -- Step 2: Create Organizations
    INSERT INTO \"Organization\" (id, name, \"createdAt\", \"updatedAt\")
    VALUES
        ('788551fd-57e3-4854-87e5-8f7a5ff404f9', 'Tech Corp', NOW(), NOW()),
        ('123e4567-e89b-12d3-a456-426614174000', 'StartupXYZ', NOW(), NOW()),
        ('987fcdeb-51a2-43d1-9f12-0123456789ab', 'Enterprise Solutions', NOW(), NOW());

    -- Step 3: Update Users to add orgId (assign users to organizations)
    UPDATE \"User\" SET \"orgId\" = '788551fd-57e3-4854-87e5-8f7a5ff404f9' WHERE id = 'e99335bd-9dd7-4260-8977-2eeaa4df799c';
    UPDATE \"User\" SET \"orgId\" = '788551fd-57e3-4854-87e5-8f7a5ff404f9' WHERE id = '68992d1e-e119-4874-b768-bf685d10194e';
    UPDATE \"User\" SET \"orgId\" = '123e4567-e89b-12d3-a456-426614174000' WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    UPDATE \"User\" SET \"orgId\" = '987fcdeb-51a2-43d1-9f12-0123456789ab' WHERE id = 'b2c3d4e5-f6g7-8901-bcde-f12345678901';

    -- Step 4: Create Positions (now that users and orgs exist)
    INSERT INTO \"Position\" (id, title, \"orgId\", tags, \"createdAt\", \"updatedAt\", \"createdBy\")
    VALUES
        ('pos-frontend-uuid-1234567890abcd', 'Frontend Developer', '788551fd-57e3-4854-87e5-8f7a5ff404f9', '{\"JavaScript\",\"React\",\"TypeScript\"}', NOW(), NOW(), 'e99335bd-9dd7-4260-8977-2eeaa4df799c'),
        ('pos-backend-uuid-1234567890abcde', 'Backend Developer', '788551fd-57e3-4854-87e5-8f7a5ff404f9', '{\"Node.js\",\"TypeScript\",\"Database\"}', NOW(), NOW(), 'e99335bd-9dd7-4260-8977-2eeaa4df799c'),
        ('pos-fullstack-uuid-123456789abcd', 'Full Stack Engineer', '123e4567-e89b-12d3-a456-426614174000', '{\"JavaScript\",\"Python\",\"React\",\"Node.js\"}', NOW(), NOW(), 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
        ('pos-senior-uuid-1234567890abcdef', 'Senior Software Engineer', '987fcdeb-51a2-43d1-9f12-0123456789ab', '{\"Python\",\"Senior\",\"Remote\"}', NOW(), NOW(), 'b2c3d4e5-f6g7-8901-bcde-f12345678901');
"

echo "Database seeded successfully!"