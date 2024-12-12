export interface MailchimpSubscribeResponse {
  status: 'success' | 'error';
  message?: string;
  error?: string;
  id?: string;
}

export interface MailchimpSubscribeRequest {
  email: string;
  name?: string;
}