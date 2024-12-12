import type { Handler } from '@netlify/functions';
import mailchimp from '@mailchimp/mailchimp_marketing';
import type { MailchimpError } from '@mailchimp/mailchimp_marketing';

// Configuration validation
const REQUIRED_CONFIG = {
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
  listId: process.env.MAILCHIMP_LIST_ID,
};

// Check for missing configuration
const missingConfig = Object.entries(REQUIRED_CONFIG)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  throw new Error(`Missing required Mailchimp configuration: ${missingConfig.join(', ')}`);
}

// Initialize Mailchimp with API key and server prefix
mailchimp.setConfig({
  apiKey: REQUIRED_CONFIG.apiKey,
  server: REQUIRED_CONFIG.server?.toLowerCase(),
});

// Validate Mailchimp configuration
async function validateMailchimpConfig() {
  try {
    // First check if we can connect to Mailchimp
    const pingResponse = await mailchimp.ping.get();
    if (pingResponse.health_status !== 'healthy') {
      console.error('Mailchimp API is not healthy');
      return false;
    }

    // Then verify the list exists
    await mailchimp.lists.getList(REQUIRED_CONFIG.listId!);
    return true;
  } catch (error) {
    console.error('Mailchimp configuration validation failed:', error);
    return false;
  }
}

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        status: 'error' as const,
        error: 'Method Not Allowed' 
      }),
    };
  }

  try {
    // Validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          status: 'error' as const,
          error: 'Request body is required' 
        }),
      };
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          status: 'error' as const,
          error: 'Invalid JSON in request body' 
        }),
      };
    }

    const { name, email } = parsedBody;

    // Validate inputs
    if (!email) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          status: 'error' as const,
          error: 'Please provide an email address' 
        }),
      };
    }

    // Validate Mailchimp configuration before proceeding
    const isConfigValid = await validateMailchimpConfig();
    if (!isConfigValid) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          status: 'error' as const,
          error: 'Invalid Mailchimp configuration. Please check your API key and server prefix.' 
        }),
      };
    }

    // Add member to list
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID!,
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name || 'Subscriber',
        },
        tags: ['Website Signup']
      }
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        status: 'success' as const,
        message: "Thanks for subscribing! You'll hear from us soon.",
        id: response.id,
      }),
    };

  } catch (error: any) {
    // Check if it's a Mailchimp API error
    if (error.response) {
      const errorBody = error.response.body || {};
      let errorMessage = 'Unable to subscribe at this time';
      
      // Handle common Mailchimp errors
      if (errorBody.title?.includes('Member Exists')) {
        errorMessage = 'This email is already subscribed';
      } else if (errorBody.title?.includes('Invalid Resource')) {
        errorMessage = 'Please provide a valid email address';
      } else if (errorBody.title?.includes('API Key Invalid')) {
        errorMessage = 'Invalid API configuration';
        console.error('Invalid API Key:', REQUIRED_CONFIG.apiKey);
      } else if (error.response.status >= 500) {
        errorMessage = 'Mailchimp service is temporarily unavailable';
      } else if (errorBody.detail) {
        errorMessage = errorBody.detail;
      }
      
      console.error('Mailchimp API error:', {
        status: error.response.status,
        message: errorMessage,
        detail: errorBody.detail,
      });
      
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          status: 'error' as const,
          error: errorMessage,
        }),
      };
    }
    
    console.error('Unexpected server error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        status: 'error' as const,
        error: 'An unexpected error occurred. Please try again later.',
      }),
    };
  }
};

export { handler };