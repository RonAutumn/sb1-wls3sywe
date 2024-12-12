import type { MailchimpSubscribeRequest, MailchimpSubscribeResponse } from './types';
import { MAILCHIMP_CONFIG } from './config';
import { MailchimpError, NetworkError } from './errors';

export async function makeSubscribeRequest(data: MailchimpSubscribeRequest): Promise<Response> {
  try {
    return await fetch(MAILCHIMP_CONFIG.FUNCTION_PATH, {
      method: 'POST',
      headers: MAILCHIMP_CONFIG.HEADERS,
      body: JSON.stringify(data)
    });
  } catch (error) {
    throw new NetworkError('Failed to connect to the subscription service');
  }
}

export async function parseSubscribeResponse(response: Response): Promise<MailchimpSubscribeResponse> {
  let text: string;
  try {
    text = await response.text() || '{}';
  } catch (e) {
    throw new NetworkError('Failed to read response from subscription service');
  }

  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') {
      throw new MailchimpError('Invalid response from server');
    }
    
    if (data.status === 'error') {
      const error = data.error || 'Subscription failed';
      console.error('Mailchimp subscription error:', error);
      throw new MailchimpError(error, response.status);
    }
    
    if (!data.status) {
      console.error('Invalid response format:', data);
      throw new MailchimpError('Server returned an invalid response format');
    }
    
    return data as MailchimpSubscribeResponse;
  } catch (e) {
    if (e instanceof MailchimpError) {
      throw e;
    }
    console.error('Failed to parse response:', e, text);
    throw new MailchimpError('Unable to process the subscription response');
  }
}