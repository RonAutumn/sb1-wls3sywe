import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, id, ...props }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-white/90 text-sm mb-1">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
      />
    </div>
  );
}