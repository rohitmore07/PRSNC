
import type { SVGProps } from "react";

export type PRSNCLogoVariant = "mascot" | "mark" | "markLight";

export function PRSNCLogo({
  variant = "mascot",
  ...props
}: SVGProps<SVGSVGElement> & { variant?: PRSNCLogoVariant }) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <image
        href="/alien.svg"
        width="512"
        height="512"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
