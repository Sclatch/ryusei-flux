"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MenuLink = {
  label: string;
  href: string;
  external?: boolean;
};

// Edit this list to change what shows up in the menu.
const defaultLinks: MenuLink[] = [
  { label: "Home", href: "/" },
  { label: "Somedo", href: "/somed" },
  {
    label: "GitHub",
    href: "https://github.com/Sclatch/ryusei-flux",
    external: true,
  },
];

const linkBase =
  "flex items-center justify-between rounded-md px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

/* Lets any client component inside the page open or close the menu. */
type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenu must be used inside <BurgerMenu>.");
  }
  return ctx;
}

/**
 * Burger button + left sidebar that wraps the page.
 *
 * - md and up: the sidebar pushes the page to the right (nothing is covered).
 * - Below md: there is too little room to push, so it overlays the page
 *   with a backdrop instead.
 */
export default function BurgerMenu({
  links = defaultLinks,
  children,
}: {
  links?: MenuLink[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // While open: Escape closes the menu. On small screens (overlay mode),
  // the page behind it also can't scroll.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const lockScroll = window.matchMedia("(max-width: 767px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (lockScroll) document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-dvh">
        {/* Burger Button / close button: stays above the panel so it works as both */}
        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
          className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-md border border-zinc-800 bg-zinc-950/70 backdrop-blur transition-colors hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-zinc-100 transition-all duration-300 motion-reduce:transition-none ${
                open ? "top-[7px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-5 bg-zinc-100 transition-opacity duration-300 motion-reduce:transition-none ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-zinc-100 transition-all duration-300 motion-reduce:transition-none ${
                open ? "top-[7px] -rotate-45" : "top-[14px]"
              }`}
            />
          </span>
        </button>

        {/* Backdrop: small screens only (overlay mode) */}
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-30 bg-black/60 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        {/* Side panel: slides in from the left.
            `invisible` when closed also removes the links from the tab order. */}
        <nav
          id="site-menu"
          aria-label="Site menu"
          className={`fixed inset-y-0 left-0 z-40 w-52 max-w-[vw] border-r border-zinc-800 bg-zinc-950 pt-20 transition-[transform,translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
            open ? "visible translate-x-0" : "invisible -translate-x-full"
          }`}
        >
          <ul className="flex flex-col gap-1 px-3">
            {links.map((link) => {
              const active = !link.external && pathname === link.href;
              const style = `${linkBase} ${
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`;

              return (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className={style}
                    >
                      {link.label}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={style}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Spacer: reserves the panel's width on md+ so the page is pushed
            to the right instead of being covered. Same duration as the panel. */}
        <div
          aria-hidden="true"
          className={`hidden shrink-0 transition-[width] duration-300 ease-out motion-reduce:transition-none md:block ${
            open ? "w-52" : "w-0"
          }`}
        />

        {/* The page itself. Clicking anywhere in it closes the menu
            (keyboard users can press Escape instead). */}
        <div
          className="min-w-0 flex-1"
          onClick={() => {
            if (open) setOpen(false);
          }}
        >
          {children}
        </div>
      </div>
    </MenuContext.Provider>
  );
}

/**
 * A button that opens the menu. Use it anywhere inside the page, including
 * from server components like page.tsx.
 */
export function OpenMenuButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { setOpen } = useMenu();

  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        // Don't let the page's "click to close" handler see this click.
        e.stopPropagation();
        setOpen(true);
      }}
    >
      {children}
    </button>
  );
}