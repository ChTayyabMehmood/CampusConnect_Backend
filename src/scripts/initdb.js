const pool = require("../config/database");

const initDb = async () => {
  try {
    console.log("🔄 Creating all tables...");

    // 1. USER (already created)
    await pool.query(`
            CREATE TABLE IF NOT EXISTS "USER" (
                  -- Primary Key
                  id SERIAL PRIMARY KEY,

                  -- Core Identity Fields
                  email VARCHAR(255) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,          -- Store hashed password
                  first_name VARCHAR(100) NOT NULL,
                  last_name VARCHAR(100) NOT NULL,

                  -- Role & Status
                  role VARCHAR(50) DEFAULT 'student',     -- 'student' | 'mentor' | 'club_admin' | 'student_mentor'
                  is_verified BOOLEAN DEFAULT FALSE,

                  -- Profile Picture
                  profile_picture_url VARCHAR(500),        -- URL to avatar/image

                  -- Timestamps
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              );  
      `);

    console.log("✅ USER already exists");

    // 2. STUDENT_PROFILE
    await pool.query(`
            CREATE TABLE IF NOT EXISTS STUDENT_PROFILE (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE REFERENCES "USER"(id) ON DELETE CASCADE,
                college VARCHAR(255) NOT NULL,
                graduation_year INTEGER,
                major VARCHAR(100),
                bio TEXT,
                skills TEXT[],
                github_url VARCHAR(255),
                linkedin_url VARCHAR(255),
                portfolio_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ STUDENT_PROFILE created");

    // 3. MENTOR_PROFILE
    await pool.query(`
            CREATE TABLE IF NOT EXISTS MENTOR_PROFILE (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE REFERENCES "USER"(id) ON DELETE CASCADE,
                company VARCHAR(255) NOT NULL,
                job_title VARCHAR(255) NOT NULL,
                years_experience INTEGER NOT NULL,
                expertise TEXT[],
                bio TEXT,
                linkedin_url VARCHAR(255),
                github_url VARCHAR(255),
                portfolio_url VARCHAR(255),
                availability VARCHAR(50) DEFAULT 'flexible',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ MENTOR_PROFILE created");

    // 4. CLUB_ADMIN_PROFILE
    await pool.query(`
            CREATE TABLE IF NOT EXISTS CLUB_ADMIN_PROFILE (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE REFERENCES "USER"(id) ON DELETE CASCADE,
                club_id INTEGER NOT NULL,
                role_in_club VARCHAR(100) DEFAULT 'admin',
                bio TEXT,
                contact_email VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ CLUB_ADMIN_PROFILE created");

    // 5. OPPORTUNITY
    await pool.query(`
            CREATE TABLE IF NOT EXISTS OPPORTUNITY (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50) NOT NULL,
                mode VARCHAR(50),
                location VARCHAR(255),
                deadline DATE,
                organizer VARCHAR(255),
                organizer_email VARCHAR(255),
                organizer_website VARCHAR(255),
                created_by INTEGER REFERENCES "USER"(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ OPPORTUNITY created");

    // 6. TEAM
    await pool.query(`
            CREATE TABLE IF NOT EXISTS TEAM (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                max_members INTEGER DEFAULT 4,
                opportunity_id INTEGER REFERENCES OPPORTUNITY(id) ON DELETE SET NULL,
                created_by INTEGER REFERENCES "USER"(id) ON DELETE SET NULL,
                status VARCHAR(50) DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ TEAM created");

    // 7. TEAMMEMBER
    await pool.query(`
            CREATE TABLE IF NOT EXISTS TEAMMEMBER (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                team_id INTEGER NOT NULL REFERENCES TEAM(id) ON DELETE CASCADE,
                role VARCHAR(50) DEFAULT 'member',
                status VARCHAR(50) DEFAULT 'active',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, team_id)
            );
        `);
    console.log("✅ TEAMMEMBER created");

    // 8. APPLYENTITY
    await pool.query(`
            CREATE TABLE IF NOT EXISTS APPLYENTITY (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                opportunity_id INTEGER NOT NULL REFERENCES OPPORTUNITY(id) ON DELETE CASCADE,
                status VARCHAR(50) DEFAULT 'pending',
                message TEXT,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, opportunity_id)
            );
        `);
    console.log("✅ APPLYENTITY created");

    // 9. CLUB
    await pool.query(`
            CREATE TABLE IF NOT EXISTS CLUB (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                college VARCHAR(255) NOT NULL,
                logo_url VARCHAR(500),
                website VARCHAR(255),
                email VARCHAR(255),
                created_by INTEGER REFERENCES "USER"(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ CLUB created");

    // 10. CLUBMEMBER
    await pool.query(`
            CREATE TABLE IF NOT EXISTS CLUBMEMBER (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                club_id INTEGER NOT NULL REFERENCES CLUB(id) ON DELETE CASCADE,
                role VARCHAR(50) DEFAULT 'member',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, club_id)
            );
        `);
    console.log("✅ CLUBMEMBER created");

    // 11. SAVED
    await pool.query(`
            CREATE TABLE IF NOT EXISTS SAVED (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                opportunity_id INTEGER REFERENCES OPPORTUNITY(id) ON DELETE CASCADE,
                club_id INTEGER REFERENCES CLUB(id) ON DELETE CASCADE,
                team_id INTEGER REFERENCES TEAM(id) ON DELETE CASCADE,
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CHECK (
                    opportunity_id IS NOT NULL OR
                    club_id IS NOT NULL OR
                    team_id IS NOT NULL
                )
            );
        `);
    console.log("✅ SAVED created");

    // 12. MENTORSESSION
    await pool.query(`
            CREATE TABLE IF NOT EXISTS MENTORSESSION (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                mentor_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                session_date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                status VARCHAR(50) DEFAULT 'scheduled',
                notes TEXT,
                meeting_link VARCHAR(500),
                booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ MENTORSESSION created");

    // 13. MESSAGELOG
    await pool.query(`
            CREATE TABLE IF NOT EXISTS MESSAGELOG (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                receiver_id INTEGER NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                read_at TIMESTAMP
            );
        `);
    console.log("✅ MESSAGELOG created");

    console.log("✅ All tables created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

initDb();
