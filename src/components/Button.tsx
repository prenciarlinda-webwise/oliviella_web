import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "secondary" | "light" | "accent";

const variants: Record<Variant, string> = {
  primary: "bg-olive text-cream hover:bg-olive-deep shadow-sm shadow-olive/20",
  secondary:
    "border border-olive/30 text-olive-deep hover:border-olive hover:bg-olive-mist/60",
  light: "bg-cream text-olive-deep hover:bg-blush-soft",
  accent:
    "bg-marigold text-olive-deep hover:bg-marigold-bright shadow-sm shadow-marigold/30",
};

export default function Button({
  href,
  children,
  variant = "primary",
  withArrow = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
}) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {withArrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  if (isExternal) {
    return (
      <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
