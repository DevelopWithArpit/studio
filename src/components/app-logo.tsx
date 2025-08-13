
import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.3999 2.4001L15.5999 5.6001L18.7999 2.4001L21.9999 5.6001L18.7999 8.8001L21.9999 12.0001L18.7999 15.2001L21.9999 18.4001L18.7999 21.6001L15.5999 18.4001L12.3999 21.6001L9.1999 18.4001L5.9999 21.6001L2.7999 18.4001L5.9999 15.2001L2.7999 12.0001L5.9999 8.8001L2.7999 5.6001L5.9999 2.4001L9.1999 5.6001L12.3999 2.4001Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
