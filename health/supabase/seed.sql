-- Seed data for Health Dashboard development
-- This file contains sample data for testing and development

-- Insert default user (for local development)
INSERT INTO users (id, email, full_name) VALUES
('00000000-0000-0000-0000-000000000001', 'health@example.com', 'Health Dashboard User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample meal presets
INSERT INTO meal_presets (user_id, name, category, calories, protein, carbs, fat, caffeine) VALUES
('00000000-0000-0000-0000-000000000001', 'Black Coffee', 'drink', 5, 0.5, 0, 0, 95),
('00000000-0000-0000-0000-000000000001', 'Green Tea', 'drink', 0, 0, 0, 0, 30),
('00000000-0000-0000-0000-000000000001', 'Greek Yogurt (Plain)', 'snack', 150, 15, 6, 8, 0),
('00000000-0000-0000-0000-000000000001', 'Almonds (1oz)', 'snack', 160, 6, 6, 14, 0),
('00000000-0000-0000-0000-000000000001', 'Egg (Large)', 'breakfast', 70, 6, 0.5, 5, 0),
('00000000-0000-0000-0000-000000000001', 'Chicken Breast (4oz)', 'lunch', 165, 31, 0, 3.6, 0),
('00000000-0000-0000-0000-000000000001', 'Sweet Potato (Medium)', 'lunch', 112, 2, 26, 0.1, 0),
('00000000-0000-0000-0000-000000000001', 'Broccoli (1 cup)', 'dinner', 55, 4, 11, 0.6, 0),
('00000000-0000-0000-0000-000000000001', 'Salmon (4oz)', 'dinner', 206, 22, 0, 12, 0),
('00000000-0000-0000-0000-000000000001', 'Quinoa (1 cup cooked)', 'dinner', 222, 8, 39, 3.6, 0);

-- Insert sample wellness entries
INSERT INTO wellness_entries (user_id, date, energy_score, mood_score, clarity_score, notes, source) VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 7, 8, 5, 'Good start to the day', 'manual'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 8, 9, 7, 'Productive day', 'manual'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 6, 7, 6, 'Feeling a bit tired', 'manual');

-- Insert sample activity data
INSERT INTO activity_entries (user_id, date, steps, active_calories, total_calories, exercise_minutes, source) VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 12847, 450, 2200, 77, 'apple_health'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 11234, 380, 2100, 55, 'apple_health'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 9876, 320, 1950, 42, 'apple_health');

-- Insert sample workout data
INSERT INTO workout_entries (user_id, date, activity_type, duration_minutes, calories_burned, strain_score, source) VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 'Weightlifting', 55, 312, 14.2, 'whoop'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 'Running', 22, 198, 16.8, 'whoop'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'Swimming', 45, 385, 12.1, 'whoop');

-- Insert sample sleep data
INSERT INTO sleep_entries (user_id, date, time_asleep_minutes, efficiency_percentage, hrv_score, rhr, recovery_score, source) VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 528, 89, 102, 41, 87, 'whoop'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 525, 94, 108, 41, 92, 'whoop'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 756, 87, 95, 43, 85, 'whoop');

-- Insert sample cognitive data
INSERT INTO cognitive_entries (user_id, date, deep_work_minutes, screen_time_minutes, focus_ratio, social_battery_percentage) VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 252, 185, 0.58, 73),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 320, 240, 0.67, 68),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 180, 165, 0.52, 75);

-- Insert sample work sessions
INSERT INTO work_sessions (user_id, date, start_time, end_time, activity_type, duration_minutes, context, productivity_score) VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, '09:00', '11:30', 'deep_work', 150, 'Writing Article', 4),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, '14:00', '15:45', 'deep_work', 105, 'Code Review', 5),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', '10:00', '10:20', 'meditation', 20, 'Morning Meditation', 5);

-- Insert sample blood test data
INSERT INTO blood_tests (user_id, test_date, total_cholesterol, hdl_cholesterol, ldl_cholesterol, triglycerides, fasting_glucose, vitamin_d, provider) VALUES
('00000000-0000-0000-0000-000000000001', '2024-05-01', 187, 59, 128, 66, 78, 45.2, 'labcorp'),
('00000000-0000-0000-0000-000000000001', '2024-08-23', 195, 75, 105, 71, 82, 52.8, 'labcorp'),
('00000000-0000-0000-0000-000000000001', '2025-05-08', 193, 78.5, 98, 83, NULL, NULL, 'labcorp');

-- Insert sample user goals
INSERT INTO user_goals (user_id, metric_type, target_value, unit) VALUES
('00000000-0000-0000-0000-000000000001', 'calories', 3000, 'kcal'),
('00000000-0000-0000-0000-000000000001', 'protein', 150, 'g'),
('00000000-0000-0000-0000-000000000001', 'carbs', 330, 'g'),
('00000000-0000-0000-0000-000000000001', 'fat', 110, 'g'),
('00000000-0000-0000-0000-000000000001', 'fiber', 30, 'g'),
('00000000-0000-0000-0000-000000000001', 'sugar', 40, 'g'),
('00000000-0000-0000-0000-000000000001', 'steps', 10000, 'steps'),
('00000000-0000-0000-0000-000000000001', 'deep_work', 300, 'minutes');
