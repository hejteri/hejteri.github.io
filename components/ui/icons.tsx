import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function DiscordIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-6", className)} aria-hidden="true">
      <path
        d="M8.8 5.4A14.4 14.4 0 0 1 12 5c1.1 0 2.2.1 3.2.4l.4 1.2c1.2.2 2.4.7 3.5 1.4a14 14 0 0 1-1.8 9 12.7 12.7 0 0 1-3.1 1.6l-.7-1.1c.7-.2 1.3-.6 1.9-1-1.7.8-3.7 1.1-5.4 1.1s-3.7-.3-5.4-1.1c.6.4 1.2.8 1.9 1l-.7 1.1A12.7 12.7 0 0 1 4.7 17a14 14 0 0 1-1.8-9 12 12 0 0 1 3.5-1.4l.4-1.2Zm-1 8.5c.7 0 1.3-.7 1.3-1.6 0-.9-.6-1.6-1.3-1.6-.8 0-1.4.7-1.3 1.6 0 .9.6 1.6 1.3 1.6Zm8.4 0c.8 0 1.4-.7 1.3-1.6 0-.9-.6-1.6-1.3-1.6s-1.3.7-1.3 1.6c0 .9.5 1.6 1.3 1.6Z"
        className="fill-current"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-6", className)} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.8" r="1.2" className="fill-current" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-6", className)} aria-hidden="true">
      <path
        d="M14.4 4.2c.5 1.4 1.5 2.5 3 3.1.7.3 1.4.4 2.1.4v2.8a8 8 0 0 1-2.4-.4 8.3 8.3 0 0 1-1.9-.9v5.1c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.3 0 .6 0 .9.1V12a2.9 2.9 0 0 0-.9-.1c-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3 2.4-1 2.4-2.3V4.2h2.8Z"
        className="fill-current"
      />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-6", className)} aria-hidden="true">
      <path
        d="M5 4h4.1l3.2 4.7L16.7 4H19l-5.6 6.4L20 20h-4.1l-3.6-5.2L7.7 20H5.4l5.8-6.7L5 4Zm3 1.8H6.9l9 12.4H17L8 5.8Z"
        className="fill-current"
      />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-4", className)} aria-hidden="true">
      <rect x="8" y="8" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 14H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-4", className)} aria-hidden="true">
      <path
        d="M2.7 12s3.3-6 9.3-6 9.3 6 9.3 6-3.3 6-9.3 6-9.3-6-9.3-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-4", className)} aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-5", className)} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-5", className)} aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
