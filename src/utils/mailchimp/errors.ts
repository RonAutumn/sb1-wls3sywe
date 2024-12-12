export class MailchimpError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'MailchimpError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}