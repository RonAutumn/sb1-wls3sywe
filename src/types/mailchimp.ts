export interface MailchimpResponse {
  id: string;
  message?: string;
  error?: string;
}

export interface MailchimpError {
  status: number;
  title: string;
}