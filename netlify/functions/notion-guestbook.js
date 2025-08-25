const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Received request:', event.httpMethod, event.body);
    
    // Check if required environment variables are set
    if (!process.env.NOTION_API_KEY) {
      console.error('NOTION_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: JSON.stringify({ error: 'Server configuration error: Missing API key' }),
      };
    }

    if (!process.env.NOTION_DATABASE_ID) {
      console.error('NOTION_DATABASE_ID environment variable is not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: JSON.stringify({ error: 'Server configuration error: Missing database ID' }),
      };
    }

    const { name, message, timestamp, browser } = JSON.parse(event.body);
    console.log('Parsed data:', { name, message: message?.substring(0, 50), timestamp, browser: browser?.substring(0, 50) });

    // Validate input
    if (!message || message.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Create new page in Notion database
    console.log('Creating Notion page with database ID:', process.env.NOTION_DATABASE_ID);
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name || 'Anonymous Visitor',
              },
            },
          ],
        },
        Message: {
          rich_text: [
            {
              text: {
                content: message.substring(0, 500),
              },
            },
          ],
        },
        Date: {
          date: {
            start: timestamp || new Date().toISOString(),
          },
        },
        Browser: {
          rich_text: [
            {
              text: {
                content: browser || 'Unknown',
              },
            },
          ],
        },
      },
    });

    console.log('Successfully created Notion page:', response.id);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        id: response.id,
      }),
    };
  } catch (error) {
    console.error('Error creating Notion entry:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({
        error: 'Failed to create entry',
        details: error.message,
      }),
    };
  }
};
