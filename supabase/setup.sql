-- Create meal_entries table
CREATE TABLE IF NOT EXISTS meal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT,
    meal_name TEXT,
    calories NUMERIC,
    protein NUMERIC,
    carbs NUMERIC,
    fat NUMERIC,
    fiber NUMERIC,
    added_sugar NUMERIC,
    sodium NUMERIC,
    magnesium NUMERIC,
    iron NUMERIC,
    zinc NUMERIC,
    potassium NUMERIC,
    vitamin_b6 NUMERIC,
    created_at TIMESTAMP DEFAULT NOW(),
    date DATE DEFAULT CURRENT_DATE
);

-- Enable Row Level Security
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON meal_entries
    FOR SELECT USING (true);

-- Create policy to allow public insert access (adjust as needed)
CREATE POLICY "Allow public insert access" ON meal_entries
    FOR INSERT WITH CHECK (true);

-- Optional: Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_meal_entries_date ON meal_entries(date);

-- Optional: Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_meal_entries_created_at ON meal_entries(created_at);

