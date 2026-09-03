import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-sm transition-transform active:scale-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, className, ...props }) {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) return null;

  return (
    <img
      src={src}
      alt={alt || 'User Avatar'}
      onError={() => setHasError(true)}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-semibold text-white uppercase select-none tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Avatar;
