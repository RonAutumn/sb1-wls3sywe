import React from 'react';
import { Instagram, Facebook, MessageSquare } from 'lucide-react';

export function SocialIcons() {
  return (
    <div className="flex items-center justify-center gap-8">
      <SocialLink href="https://instagram.com" icon={Instagram} />
      <SocialLink href="https://facebook.com" icon={Facebook} />
      <SocialLink href="https://tiktok.com" icon={MessageSquare} />
    </div>
  );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: React.ElementType }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
    >
      <Icon className="w-8 h-8" />
    </a>
  );
}