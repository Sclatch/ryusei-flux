"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { IconType } from "react-icons/lib";
import { LuHouse, LuSmartphone, LuFileVideo } from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";

type MenuLink = {
  label: string;
  href: string;
  description?: string;
  icon: IconType;
  external?: boolean;
};

// Edit this list to change what shows up in the menu.
const defaultLinks: MenuLink[] = [
  {
    label: "Home",
    description: "Where you first landed",
    href: "/",
    icon: LuHouse,
  },
  {
    label: "Somedo",
    description: "Social Media Videos Downloader",
    href: "/somed",
    icon: LuSmartphone,
  },
  {
    label: "Comprestar",
    description: "Compress video sizes",
    href: "/comprestar",
    icon: LuFileVideo,
  },
  {
    label: "GitHub",
    description: "View the source code",
    href: "https://github.com/Sclatch/ryusei-flux",
    icon: FaGithub,
    external: true,
  },
];

const linkBase =
  "flex items-center justify-between py-2 pr-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

/** The current page's link is active, including nested routes like /somed/x. */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

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

/** Icon, label, and description: shared by internal and external links. */
function ItemBody({ link }: { link: MenuLink }) {
  return (
    <>
      <span className="flex items-center">
        <link.icon aria-hidden="true" className="mx-4 text-xl" />
        <span className="flex flex-col gap-0.5">
          <span>{link.label}</span>
          {link.description && (
            <span className="font-serif text-xs italic text-zinc-500">
              {link.description}
            </span>
          )}
        </span>
      </span>

      {link.external && (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" />
        </svg>
      )}
    </>
  );
}

/**
 * Burger button + left sidebar that wraps the page.
 *
 * - Phones (below md): the menu covers the whole screen.
 * - md and up: the menu is only as wide as its longest label or description,
 *   and pushes the page to the right instead of covering it.
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Keeps the context value stable so consumers only re-render when `open` changes.
  const menu = useMemo(() => ({ open, setOpen }), [open]);

  // The panel sizes itself to its content, but it is `fixed`, so the spacer
  // can't see its width. Measure the panel and share the result as --menu-w.
  // It re-measures if the content changes (new links, web fonts loading, ...).
  useEffect(() => {
    const nav = navRef.current;
    const wrapper = wrapperRef.current;
    if (!nav || !wrapper) return;

    const sync = () =>
      wrapper.style.setProperty("--menu-w", `${nav.offsetWidth}px`);
    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // While open: Escape closes the menu, and on phones the page behind the
  // full-screen menu can't scroll.
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
    <MenuContext.Provider value={menu}>
      <div ref={wrapperRef} className="flex min-h-dvh">
        {/* Burger / close button: stays above the panel so it works as both */}
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

        {/* Side panel: slides in from the left.
            Phones: full screen (w-full). md+: as wide as its content (w-max),
            capped so a very long description wraps instead of taking over.
            `invisible` when closed also removes the links from the tab order. */}
        <nav
          ref={navRef}
          id="site-menu"
          aria-label="Site menu"
          className={`fixed inset-y-0 left-0 z-40 w-full overflow-y-auto border-r border-zinc-800 bg-zinc-950 transition-[transform,translate,visibility] duration-300 ease-out motion-reduce:transition-none md:w-max md:max-w-sm ${
            open ? "visible translate-x-0" : "invisible -translate-x-full"
          }`}
        >
          {/* px-20 keeps the title clear of the burger button */}
          <div className="px-20 py-6">
            <span className="font-gloock text-2xl select-none">
              Flux
            </span>
          </div>

          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active = !link.external && isActive(pathname, link.href);
              const style = `${linkBase} ${
                active
                  ? "bg-zinc-900 text-white"
                  : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
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
                      <ItemBody link={link} />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={style}
                    >
                      <ItemBody link={link} />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Spacer: md+ only. Reserves exactly the panel's measured width so the
            page is pushed to the right instead of being covered. 16rem is only
            a fallback until the first measurement. */}
        <div
          aria-hidden="true"
          className={`hidden shrink-0 transition-[width] duration-300 ease-out motion-reduce:transition-none md:block ${
            open ? "w-[var(--menu-w,16rem)]" : "w-0"
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