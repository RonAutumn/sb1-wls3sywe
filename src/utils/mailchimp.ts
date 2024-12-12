import { validateEmail } from './mailchimp/validation';
import { makeSubscribeRequest, parseSubscribeResponse } from './mailchimp/api';
import type { MailchimpSubscribeResponse } from './mailchimp/types';
import { MailchimpError, ValidationError, NetworkError } from './mailchimp/errors';

export async function subscribeToMailchimp(email: string): Promise<MailchimpSubscribeResponse> {
  try {
    validateEmail(email);
    
    const response = await makeSubscribeRequest({
      email,
      name: 'Subscriber'
    });

    return await parseSubscribeResponse(response);
  } catch (error) {
    console.error('Subscription error:', error);
    if (error instanceof ValidationError || 
        error instanceof MailchimpError || 
        error instanceof NetworkError) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}