import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M12 2 L12 12" />
        <path d="M12 12 L4 20" />
        <path d="M12 12 L20 20" />
        <path d="M12 12 L12 22" />
        <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
