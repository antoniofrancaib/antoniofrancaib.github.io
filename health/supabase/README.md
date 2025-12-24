# Health Dashboard Database Architecture

This document outlines the comprehensive database schema and architecture for the Health Dashboard application.

## 🏗️ Database Schema Overview

### Core Tables

#### **users**
- User profiles and authentication
- Single user support (extensible to multi-user)

#### **meal_entries**
- Comprehensive nutritional tracking
- AI-scanned meals, manual entries, and presets
- 20+ nutritional metrics tracked

#### **meal_presets**
- Quick-add meal templates
- Favorite system for common meals

#### **wellness_entries**
- Daily Energy/Mood/Clarity tracking (1-10 scale)
- iOS Shortcut integration

#### **activity_entries**
- Daily step counts, calories, exercise minutes
- WHOOP/Apple Health integration

#### **workout_entries**
- Individual workout sessions
- Strain scores, heart rate data

#### **sleep_entries**
- WHOOP sleep data integration
- Recovery scores, HRV, efficiency

#### **cognitive_entries**
- Deep work tracking, screen time, focus ratios
- RescueTime integration

#### **work_sessions**
- Detailed work session logging
- Productivity scoring

#### **blood_tests**
- Comprehensive blood biomarker tracking
- 25+ lab metrics with historical trends

#### **user_goals**
- Personalized targets for all metrics
- Dynamic goal setting

#### **integrations**
- External service connections
- API credentials (encrypted)

## 📊 Key Features

### **Data Relationships**
- All tables linked to users with proper RLS
- Date-based partitioning for efficient queries
- Comprehensive indexing strategy

### **Views & Analytics**
- `daily_nutrition_summary` - Daily meal aggregation
- `daily_wellness_summary` - Wellness metrics with overall scores
- `weekly_health_summary` - Weekly trends and correlations

### **Storage Buckets**
- `meal-photos` - User-uploaded meal images for AI analysis
- `health-exports` - Exported data files (JSON/CSV)

### **Edge Functions**
- `wellness-shortcut` - iOS Shortcut wellness logging
- `meal-scan` - AI meal photo analysis
- `quick-meal` - Preset meal quick-add
- `export-data` - Health data export functionality

## 🚀 Getting Started

### Prerequisites
- Docker Desktop installed and running
- Supabase CLI installed (`brew install supabase/tap/supabase`)

### Local Development Setup

```bash
# Start Supabase local development environment
supabase start

# Apply database migrations
supabase db reset

# Start development server (if needed)
# Your health dashboard should connect to:
# - API: http://127.0.0.1:54321
# - Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres
# - Studio: http://127.0.0.1:54323
```

### Database Connection

Update your `js/config.js` with local Supabase credentials:

```javascript
const CONFIG = {
    SUPABASE_URL: 'http://127.0.0.1:54321',
    SUPABASE_ANON_KEY: 'your-local-anon-key'
};
```

## 🔒 Security & Privacy

### **Row Level Security (RLS)**
- All tables have RLS enabled
- Users can only access their own data
- Strict policies prevent data leakage

### **Data Encryption**
- Sensitive integration tokens encrypted
- PII handled according to best practices

## 📱 Integration Architecture

### **iOS Shortcuts**
1. **Wellness Logging**: Daily energy/mood/clarity scores
2. **Meal Presets**: Quick-add common meals
3. **Meal Scanning**: Camera integration with AI analysis

### **External APIs**
- **WHOOP**: Sleep, recovery, workout data
- **Apple Health**: Steps, activity, heart rate
- **RescueTime**: Screen time, productivity metrics
- **OpenAI Vision**: Meal photo analysis

### **Data Flow**
```
iOS Shortcut → Edge Function → Database → Dashboard Update
External API → Cron Job → Database → Real-time Sync
Manual Entry → Direct DB → Dashboard Update
```

## 📊 Analytics & Insights

### **Correlation Analysis**
- Sleep vs Energy correlations
- Protein intake vs Mood tracking
- Screen time vs Clarity patterns
- Weekly trend analysis

### **Health Score Calculations**
- Overall wellness score (Energy + Mood + Clarity) / 3
- Focus ratio (Deep Work / Total Productive Time)
- Recovery efficiency (Sleep quality metrics)

## 🔄 Migration Strategy

### **From Current Setup**
1. Export existing data from current Supabase project
2. Run migration scripts to transform data structure
3. Import into new schema with enhanced relationships
4. Update application code to use new endpoints

### **Data Preservation**
- All historical meal data maintained
- Wellness tracking history preserved
- Blood test results with full biomarker history
- Integration settings migrated

## 🛠️ Development Workflow

### **Local Development**
```bash
# Make schema changes
supabase migration new add_new_feature

# Apply changes
supabase db reset

# Test edge functions
supabase functions serve wellness-shortcut
```

### **Production Deployment**
```bash
# Link to production project
supabase link --project-ref your-project-id

# Deploy schema changes
supabase db push

# Deploy edge functions
supabase functions deploy wellness-shortcut
supabase functions deploy meal-scan
supabase functions deploy quick-meal
supabase functions deploy export-data
```

## 📈 Performance Optimizations

### **Indexing Strategy**
- Date-based indexes on all time-series data
- User-specific composite indexes
- Full-text search on meal names and notes

### **Query Optimization**
- Efficient aggregation queries for dashboards
- Cached views for common analytics
- Optimized JOIN operations

## 🔧 Maintenance

### **Backup Strategy**
- Daily automated backups
- Point-in-time recovery available
- Data export functionality for users

### **Monitoring**
- Query performance monitoring
- Storage usage tracking
- Edge function error logging

## 🎯 Future Enhancements

### **Phase 2 Features**
- Multi-user household support
- Advanced AI insights and recommendations
- Integration with additional wearables
- Advanced correlation analysis
- Predictive health modeling

### **Scalability Considerations**
- Database partitioning by date ranges
- Read replicas for analytics queries
- CDN integration for meal photos
- Background job processing for AI analysis

---

## 📋 Quick Setup Checklist

- [ ] Docker Desktop installed and running
- [ ] Supabase CLI installed
- [ ] Local Supabase environment started
- [ ] Database migrations applied
- [ ] Edge functions deployed locally
- [ ] Application connected to local Supabase
- [ ] Data seeding completed
- [ ] All integrations tested

For detailed setup instructions, see the main project README.md.
