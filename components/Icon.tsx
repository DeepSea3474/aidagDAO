import React from 'react';

export type IconName =
  | 'bolt' | 'hexagon' | 'globe' | 'clock' | 'shield' | 'cpu' | 'check' | 'sparkle'
  | 'chat' | 'twitter' | 'code' | 'governance' | 'search' | 'coin' | 'bridge'
  | 'lock' | 'hammer' | 'brain' | 'link' | 'map' | 'broadcast' | 'document'
  | 'rocket' | 'wallet' | 'flame' | 'cube' | 'network' | 'pulse' | 'gem';

interface Props {
  name: IconName;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.6 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  switch (name) {
    case 'bolt':
      return <svg {...common}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>;
    case 'hexagon':
      return <svg {...common}><path d="M12 2l8.66 5v10L12 22 3.34 17V7L12 2z" /><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" /></svg>;
    case 'globe':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>;
    case 'network':
      return <svg {...common}><circle cx="12" cy="5" r="2.2" /><circle cx="5" cy="18" r="2.2" /><circle cx="19" cy="18" r="2.2" /><path d="M12 7.2L6.5 16M12 7.2L17.5 16M7.2 18h9.6" /></svg>;
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'shield':
      return <svg {...common}><path d="M12 2l8 3.5v6c0 4.7-3.4 9-8 10.5-4.6-1.5-8-5.8-8-10.5v-6L12 2z" /><path d="M9 12l2 2 4-4" /></svg>;
    case 'lock':
      return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /><circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" /></svg>;
    case 'cpu':
      return <svg {...common}><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></svg>;
    case 'check':
      return <svg {...common}><path d="M5 13l4 4L19 7" /></svg>;
    case 'sparkle':
      return <svg {...common}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="2.5" /></svg>;
    case 'chat':
      return <svg {...common}><path d="M21 11.5a8.4 8.4 0 01-3.6 6.9L18 22l-4.1-2a9.6 9.6 0 01-1.9.2 8.5 8.5 0 119-8.7z" /></svg>;
    case 'twitter':
      return <svg {...common}><path d="M4 4l7.5 10L4.5 20h2.4l5.6-5.5L17 20h3l-7.8-10.4L19.5 4h-2.4L12 8.9 8 4H4z" fill="currentColor" stroke="none" /></svg>;
    case 'code':
      return <svg {...common}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16" /></svg>;
    case 'governance':
      return <svg {...common}><path d="M3 22h18M3 10h18M5 10v12M9 10v12M15 10v12M19 10v12M2 10L12 3l10 7" /></svg>;
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>;
    case 'coin':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.7 0-3 1-3 2.5s1.3 2.5 3 2.5 3 1 3 2.5-1.3 2.5-3 2.5c-1 0-2-.5-2.5-1.5M12 6.5V8M12 16v1.5" /></svg>;
    case 'bridge':
      return <svg {...common}><path d="M3 17v-3M21 17v-3M3 14a9 9 0 0118 0M7 14v6M11 14v6M17 14v6M21 20H3" /></svg>;
    case 'hammer':
      return <svg {...common}><path d="M14 6l4-4 4 4-4 4M16 8l-9 9M9 15l-5 5 1 1 5-5M11 13l3 3" /></svg>;
    case 'brain':
      return <svg {...common}><path d="M9 4a3 3 0 00-3 3 3 3 0 00-3 3v1a3 3 0 002 2.8V15a3 3 0 003 3 3 3 0 003 1V4a3 3 0 00-2-1zM15 4a3 3 0 013 3 3 3 0 013 3v1a3 3 0 01-2 2.8V15a3 3 0 01-3 3 3 3 0 01-3 1V4a3 3 0 012-1z" /></svg>;
    case 'link':
      return <svg {...common}><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" /></svg>;
    case 'map':
      return <svg {...common}><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>;
    case 'broadcast':
      return <svg {...common}><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 010 8.4M7.8 16.2a6 6 0 010-8.4M19 5a10 10 0 010 14M5 19a10 10 0 010-14" /></svg>;
    case 'document':
      return <svg {...common}><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" /><path d="M14 3v6h6M8 13h8M8 17h6" /></svg>;
    case 'rocket':
      return <svg {...common}><path d="M5 13c0-3.5 2-7 4-9 4 0 8 4 8 8 0 4-2 6-2 6l-4-4-4 4s-2-2-2-5z" /><path d="M9 13l2 2M5 18l-2 3 3-2M14 9a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;
    case 'wallet':
      return <svg {...common}><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18M17 15h2" /></svg>;
    case 'flame':
      return <svg {...common}><path d="M12 22c4 0 7-2.7 7-7 0-3.5-2-5-3-7-1 2-2 2-3 1-1-1-2-3-1-6-3 1-7 5-7 11 0 4.3 3 8 7 8z" /></svg>;
    case 'cube':
      return <svg {...common}><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" /><path d="M3 7l9 5 9-5M12 12v10" /></svg>;
    case 'pulse':
      return <svg {...common}><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>;
    case 'gem':
      return <svg {...common}><path d="M6 3h12l4 6-10 12L2 9l4-6z" /><path d="M2 9h20M9 3l-3 6 6 12M15 3l3 6-6 12" /></svg>;
    default:
      return null;
  }
}
