import { SVGProps } from 'react';

export const ResolvLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M100 40C65.8172 40 38 67.8172 38 102C38 136.183 65.8172 164 100 164C134.183 164 162 136.183 162 102C162 67.8172 134.183 40 100 40Z"
      className="fill-primary/20 stroke-primary"
      strokeWidth="8"
    />
    <path
      d="M100 70L130 120H70L100 70Z"
      className="fill-primary/20 stroke-primary"
      strokeWidth="8"
      strokeLinejoin="round"
    />
  </svg>
);
