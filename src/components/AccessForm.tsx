import React from 'react';
import { X } from 'lucide-react';
import { FormInput } from './FormInput';
import { LoadingSpinner } from './LoadingSpinner';
import { subscribeToMailchimp } from '../utils/mailchimp';
import type { MailchimpSubscribeResponse } from '../utils/mailchimp/types';

interface AccessFormProps {
  onClose: () => void;
}

export function AccessForm({ onClose }: AccessFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(form);
      const email = formData.get('email') as string;
      
      if (!email) {
        throw new Error('Please enter your email address');
      }

      const response = await subscribeToMailchimp(email);
      
      if (response?.status === 'success') {
        setSuccess(true);
        setTimeout(onClose, 2000);
        return;
      }
      
      throw new Error('Failed to subscribe. Please try again.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Form submission error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          type="button"
          disabled={isSubmitting || success}
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-semibold text-white mb-6">Request Access</h2>
        
        {success ? (
          <div className="text-green-400 text-center py-4 animate-fade-in">
            Thanks for subscribing! You'll hear from us soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              placeholder="Enter your email"
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded font-medium transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              <span className={`inline-flex items-center transition-opacity duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                Submit
              </span>
              {isSubmitting && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner />
                </span>
              )}
            </button>

            {error && (
              <div className="text-red-400 text-sm mt-4 text-center animate-fade-in bg-red-500/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}