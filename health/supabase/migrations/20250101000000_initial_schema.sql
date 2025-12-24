-- Health Dashboard Database Schema
-- Comprehensive schema for tracking nutrition, wellness, exercise, sleep, and cognitive metrics

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Users table (for future multi-user support)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===========================================
-- NUTRITION TRACKING
-- ===========================================

-- Meal entries with comprehensive nutritional data
CREATE TABLE IF NOT EXISTS meal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    meal_name TEXT NOT NULL,
    calories DECIMAL(8,2),
    protein DECIMAL(8,2), -- grams
    carbs DECIMAL(8,2),   -- grams
    fat DECIMAL(8,2),     -- grams
    fiber DECIMAL(8,2),   -- grams
    sugar DECIMAL(8,2),   -- grams
    alcohol DECIMAL(8,2), -- grams/units
    caffeine DECIMAL(8,2), -- mg
    sodium DECIMAL(8,2),   -- mg
    potassium DECIMAL(8,2), -- mg
    calcium DECIMAL(8,2),   -- mg
    iron DECIMAL(8,2),      -- mg
    vitamin_c DECIMAL(8,2), -- mg
    vitamin_d DECIMAL(8,2), -- mcg
    magnesium DECIMAL(8,2), -- mg
    zinc DECIMAL(8,2),       -- mg
    omega_3 DECIMAL(8,2),    -- mg
    source TEXT CHECK (source IN ('manual', 'ai_scan', 'preset', 'import')),
    meal_photo_url TEXT, -- Storage reference
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT positive_calories CHECK (calories >= 0),
    CONSTRAINT positive_macros CHECK (protein >= 0 AND carbs >= 0 AND fat >= 0),
    CONSTRAINT positive_micronutrients CHECK (
        fiber >= 0 AND sugar >= 0 AND alcohol >= 0 AND caffeine >= 0
    )
);

-- Meal presets for quick entry
CREATE TABLE IF NOT EXISTS meal_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'drink')),
    calories DECIMAL(8,2),
    protein DECIMAL(8,2),
    carbs DECIMAL(8,2),
    fat DECIMAL(8,2),
    fiber DECIMAL(8,2),
    sugar DECIMAL(8,2),
    alcohol DECIMAL(8,2),
    caffeine DECIMAL(8,2),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===========================================
-- WELLNESS TRACKING
-- ===========================================

-- Daily wellness metrics (Energy, Mood, Clarity)
CREATE TABLE IF NOT EXISTS wellness_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 10),
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    clarity_score INTEGER CHECK (clarity_score >= 1 AND clarity_score <= 10),
    notes TEXT,
    source TEXT CHECK (source IN ('manual', 'shortcut', 'scheduled')) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Ensure one entry per user per day
    UNIQUE(user_id, date)
);

-- ===========================================
-- EXERCISE & ACTIVITY TRACKING
-- ===========================================

-- Daily activity summary
CREATE TABLE IF NOT EXISTS activity_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    steps INTEGER DEFAULT 0,
    active_calories INTEGER DEFAULT 0,
    total_calories INTEGER DEFAULT 0,
    distance_km DECIMAL(6,2),
    flights_climbed INTEGER,
    stand_hours DECIMAL(4,2),
    exercise_minutes INTEGER DEFAULT 0,
    source TEXT CHECK (source IN ('apple_health', 'whoop', 'manual', 'fitbit')) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT positive_steps CHECK (steps >= 0),
    CONSTRAINT positive_calories CHECK (active_calories >= 0 AND total_calories >= 0),
    UNIQUE(user_id, date, source)
);

-- Individual workout sessions
CREATE TABLE IF NOT EXISTS workout_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_type TEXT NOT NULL, -- e.g., 'running', 'weightlifting', 'swimming'
    duration_minutes INTEGER,
    calories_burned INTEGER,
    distance_km DECIMAL(6,2),
    strain_score DECIMAL(4,2), -- WHOOP strain score (0-21)
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    notes TEXT,
    source TEXT CHECK (source IN ('whoop', 'apple_health', 'manual', 'strava')) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===========================================
-- SLEEP TRACKING
-- ===========================================

-- Sleep sessions from WHOOP/Apple Health
CREATE TABLE IF NOT EXISTS sleep_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    time_asleep_minutes INTEGER,
    time_in_bed_minutes INTEGER,
    efficiency_percentage DECIMAL(5,2), -- Sleep efficiency %
    rem_sleep_minutes INTEGER,
    deep_sleep_minutes INTEGER,
    light_sleep_minutes INTEGER,
    awake_minutes INTEGER,
    hr_average INTEGER,
    hr_minimum INTEGER,
    hr_maximum INTEGER,
    hrv_score INTEGER, -- Heart Rate Variability
    rhr INTEGER, -- Resting Heart Rate
    recovery_score INTEGER, -- WHOOP Recovery Score (0-100)
    respiratory_rate DECIMAL(4,2),
    body_temperature DECIMAL(4,2),
    source TEXT CHECK (source IN ('whoop', 'apple_health', 'oura', 'fitbit', 'manual')) DEFAULT 'whoop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT valid_efficiency CHECK (efficiency_percentage >= 0 AND efficiency_percentage <= 100),
    CONSTRAINT valid_scores CHECK (
        recovery_score >= 0 AND recovery_score <= 100 AND
        hrv_score >= 0 AND hrv_score <= 200
    ),
    UNIQUE(user_id, date, source)
);

-- ===========================================
-- COGNITIVE PERFORMANCE TRACKING
-- ===========================================

-- Daily cognitive metrics
CREATE TABLE IF NOT EXISTS cognitive_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    deep_work_minutes INTEGER DEFAULT 0,
    screen_time_minutes INTEGER DEFAULT 0,
    focus_ratio DECIMAL(4,3), -- Calculated ratio (0.000-1.000)
    social_battery_percentage INTEGER CHECK (social_battery_percentage >= 0 AND social_battery_percentage <= 100),
    meditation_minutes INTEGER DEFAULT 0,
    reading_minutes INTEGER DEFAULT 0,
    learning_sessions INTEGER DEFAULT 0,
    source TEXT CHECK (source IN ('manual', 'rescue_time', 'calendar', 'focus_app')) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Constraints
    CONSTRAINT positive_times CHECK (
        deep_work_minutes >= 0 AND screen_time_minutes >= 0 AND
        meditation_minutes >= 0 AND reading_minutes >= 0
    ),
    CONSTRAINT valid_focus_ratio CHECK (focus_ratio >= 0 AND focus_ratio <= 1),
    UNIQUE(user_id, date)
);

-- Individual work sessions
CREATE TABLE IF NOT EXISTS work_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIME NOT NULL,
    end_time TIME,
    activity_type TEXT CHECK (activity_type IN ('deep_work', 'meeting', 'email', 'admin', 'learning', 'meditation')),
    duration_minutes INTEGER,
    context TEXT, -- e.g., 'writing article', 'code review', 'research'
    productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 5),
    notes TEXT,
    source TEXT CHECK (source IN ('calendar', 'manual', 'time_tracker')) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===========================================
-- BLOOD BIOMARKERS TRACKING
-- ===========================================

-- Blood test results
CREATE TABLE IF NOT EXISTS blood_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    test_date DATE NOT NULL,
    lab_name TEXT,
    provider TEXT, -- e.g., 'labcorp', 'quest', 'private_lab'
    notes TEXT,

    -- Lipid Panel
    total_cholesterol DECIMAL(6,2), -- mg/dL
    hdl_cholesterol DECIMAL(6,2),   -- mg/dL
    ldl_cholesterol DECIMAL(6,2),   -- mg/dL
    triglycerides DECIMAL(6,2),     -- mg/dL
    vldl_cholesterol DECIMAL(6,2),  -- mg/dL

    -- Glucose Metabolism
    fasting_glucose DECIMAL(6,2),   -- mg/dL
    hba1c DECIMAL(4,2),            -- %
    insulin DECIMAL(6,2),          -- uIU/mL
    c_peptide DECIMAL(6,2),        -- ng/mL

    -- Inflammation Markers
    crp DECIMAL(6,3),              -- mg/L
    homocysteine DECIMAL(6,2),     -- umol/L
    ferritin DECIMAL(6,2),         -- ng/mL

    -- Thyroid Function
    tsh DECIMAL(6,3),              -- mIU/L
    free_t3 DECIMAL(6,3),          -- pg/mL
    free_t4 DECIMAL(6,3),          -- ng/dL
    reverse_t3 DECIMAL(6,3),       -- ng/dL

    -- Vitamin D & Minerals
    vitamin_d DECIMAL(6,2),        -- ng/mL
    b12 DECIMAL(6,2),              -- pg/mL
    folate DECIMAL(6,2),           -- ng/mL
    magnesium DECIMAL(6,2),        -- mg/dL
    zinc DECIMAL(6,2),             -- mcg/dL
    copper DECIMAL(6,2),           -- mcg/dL

    -- Liver Function
    alt DECIMAL(6,2),              -- U/L
    ast DECIMAL(6,2),              -- U/L
    alp DECIMAL(6,2),              -- U/L
    bilirubin_total DECIMAL(6,2), -- mg/dL
    bilirubin_direct DECIMAL(6,2), -- mg/dL

    -- Kidney Function
    creatinine DECIMAL(6,2),       -- mg/dL
    egfr DECIMAL(6,2),             -- mL/min/1.73m²
    bun DECIMAL(6,2),              -- mg/dL

    -- Blood Count
    wbc DECIMAL(6,2),              -- K/uL
    rbc DECIMAL(6,2),              -- M/uL
    hemoglobin DECIMAL(6,2),       -- g/dL
    hematocrit DECIMAL(6,2),       -- %
    platelets DECIMAL(6,2),        -- K/uL

    -- Blood Pressure (taken during blood draw)
    systolic_bp INTEGER,
    diastolic_bp INTEGER,

    -- Other biomarkers
    testosterone DECIMAL(6,2),     -- ng/dL
    cortisol DECIMAL(6,2),         -- mcg/dL
    dhea_s DECIMAL(6,2),           -- mcg/dL

    source TEXT CHECK (source IN ('labcorp', 'quest', 'private_lab', 'manual')) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===========================================
-- METADATA & CONFIGURATION
-- ===========================================

-- User goals and targets
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    metric_type TEXT NOT NULL, -- 'calories', 'protein', 'steps', etc.
    target_value DECIMAL(8,2) NOT NULL,
    unit TEXT, -- 'kcal', 'g', 'steps', etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(user_id, metric_type, is_active)
);

-- Integration settings for external services
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    service_name TEXT NOT NULL, -- 'whoop', 'rescue_time', 'google_calendar', 'apple_health'
    service_user_id TEXT,
    access_token TEXT, -- Encrypted in production
    refresh_token TEXT, -- Encrypted in production
    token_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency TEXT CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')) DEFAULT 'daily',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(user_id, service_name)
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Meal entries indexes
CREATE INDEX IF NOT EXISTS idx_meal_entries_user_date ON meal_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_entries_date ON meal_entries(date);
CREATE INDEX IF NOT EXISTS idx_meal_entries_source ON meal_entries(source);

-- Wellness entries indexes
CREATE INDEX IF NOT EXISTS idx_wellness_entries_user_date ON wellness_entries(user_id, date);

-- Activity entries indexes
CREATE INDEX IF NOT EXISTS idx_activity_entries_user_date ON activity_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_activity_entries_source ON activity_entries(source);

-- Sleep entries indexes
CREATE INDEX IF NOT EXISTS idx_sleep_entries_user_date ON sleep_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_sleep_entries_source ON sleep_entries(source);

-- Cognitive entries indexes
CREATE INDEX IF NOT EXISTS idx_cognitive_entries_user_date ON cognitive_entries(user_id, date);

-- Blood tests indexes
CREATE INDEX IF NOT EXISTS idx_blood_tests_user_date ON blood_tests(user_id, test_date);

-- Work sessions indexes
CREATE INDEX IF NOT EXISTS idx_work_sessions_user_date ON work_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_work_sessions_activity ON work_sessions(activity_type);

-- ===========================================
-- USEFUL VIEWS FOR QUERIES
-- ===========================================

-- Daily nutrition summary view
CREATE OR REPLACE VIEW daily_nutrition_summary AS
SELECT
    user_id,
    date,
    COUNT(*) as meals_count,
    SUM(calories) as total_calories,
    SUM(protein) as total_protein,
    SUM(carbs) as total_carbs,
    SUM(fat) as total_fat,
    SUM(fiber) as total_fiber,
    SUM(sugar) as total_sugar,
    SUM(alcohol) as total_alcohol,
    SUM(caffeine) as total_caffeine,
    AVG(CASE WHEN source = 'ai_scan' THEN 1 ELSE 0 END) as ai_scanned_meals_ratio
FROM meal_entries
GROUP BY user_id, date;

-- Daily wellness summary view
CREATE OR REPLACE VIEW daily_wellness_summary AS
SELECT
    user_id,
    date,
    energy_score,
    mood_score,
    clarity_score,
    (energy_score + mood_score + clarity_score) / 3.0 as overall_wellness_score
FROM wellness_entries;

-- Weekly averages view
CREATE OR REPLACE VIEW weekly_health_summary AS
SELECT
    user_id,
    DATE_TRUNC('week', date) as week_start,
    AVG(energy_score) as avg_energy,
    AVG(mood_score) as avg_mood,
    AVG(clarity_score) as avg_clarity,
    SUM(total_calories) as weekly_calories,
    SUM(total_protein) as weekly_protein,
    SUM(steps) as weekly_steps,
    AVG(recovery_score) as avg_recovery_score,
    AVG(deep_work_minutes) as weekly_deep_work_minutes
FROM daily_nutrition_summary dns
FULL OUTER JOIN wellness_entries we ON dns.user_id = we.user_id AND dns.date = we.date
FULL OUTER JOIN activity_entries ae ON dns.user_id = ae.user_id AND dns.date = ae.date
FULL OUTER JOIN sleep_entries se ON dns.user_id = se.user_id AND dns.date = se.date
FULL OUTER JOIN cognitive_entries ce ON dns.user_id = ce.user_id AND dns.date = ce.date
GROUP BY user_id, DATE_TRUNC('week', date);

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own meal entries" ON meal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own meal presets" ON meal_presets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own wellness entries" ON wellness_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own activity entries" ON activity_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own workout entries" ON workout_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own sleep entries" ON sleep_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own cognitive entries" ON cognitive_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own work sessions" ON work_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own blood tests" ON blood_tests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own integrations" ON integrations FOR ALL USING (auth.uid() = user_id);
