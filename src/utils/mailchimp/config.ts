export const MAILCHIMP_CONFIG = {
  FUNCTION_PATH: '/.netlify/functions/subscribe',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;