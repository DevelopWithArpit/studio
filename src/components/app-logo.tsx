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
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15A2.5 2.5 0 0 1 9.5 22" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15A2.5 2.5 0 0 0 14.5 22" />
        <path d="M12 4.5a2.5 2.5 0 0 0-2.5-2.5" />
        <path d="M12 4.5a2.5 2.5 0 0 1 2.5-2.5" />
        <path d="M12 19.5a2.5 2.5 0 0 0-2.5 2.5" />
        <path d="M12 19.5a2.5 2.5 0 0 1 2.5 2.5" />
        <path d="M2 12h5.5" />
        <path d="M16.5 12H22" />
        <path d="M7 16.5a2.5 2.5 0 0 0 5 0" />
        <path d="M12 7.5a2.5 2.5 0 0 1 5 0" />
    </svg>
  );
}
