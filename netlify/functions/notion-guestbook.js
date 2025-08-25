const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, message, timestamp, browser } = JSON.parse(event.body);

    // Validate input
    if (!message || message.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Create new page in Notion database
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
