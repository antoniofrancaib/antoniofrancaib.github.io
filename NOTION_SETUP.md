# Notion Guestbook Setup Guide

## 🎯 Quick Setup Steps

### 1. Create Notion Integration
1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "Create new integration"
3. Name: "Website Guestbook"
4. Select your workspace
5. **Copy the Integration Token** (starts with `secret_`)

### 2. Create Notion Database
1. In Notion, create a new database
2. Add these properties:
   - **Name** (Title) - Guest name
   - **Message** (Text) - Guest message  
   - **Date** (Date) - Submission date
   - **Browser** (Text) - Browser info

3. **Share database with integration:**
   - Click "Share" button
   - Add your integration
   - Give **Edit** permissions

### 3. Get Database ID
1. Open your database page
2. Copy URL: `https://notion.so/workspace/DATABASE_ID?v=...`
3. Extract the DATABASE_ID (32-character string)

### 4. Deploy Options

#### Option A: Netlify (Recommended)
1. Create account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set environment variables in Netlify dashboard:
   - `NOTION_API_KEY` = your integration token
   - `NOTION_DATABASE_ID` = your database ID
4. Deploy!

#### Option B: Vercel
1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variables:
   - `NOTION_API_KEY` = your integration token
   - `NOTION_DATABASE_ID` = your database ID
4. Deploy!

## 🧪 Testing
1. Visit your deployed site
2. Submit a test message
3. Check your Notion database - the message should appear!

## 📋 Troubleshooting
- **No messages appearing**: Check environment variables are set correctly
- **Permission errors**: Ensure integration has Edit access to database
- **API errors**: Verify integration token and database ID

## 🎉 Success!
Once set up, all guestbook messages will automatically appear in your Notion database with:
- Guest name (Anonymous Visitor by default)
- Message content
- Submission timestamp
- Browser information

You can view, filter, and manage all messages directly in Notion!
