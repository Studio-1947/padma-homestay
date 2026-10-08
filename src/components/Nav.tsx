import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, Moon, Sun, X } from "@phosphor-icons/react";
import { navLinks, site } from "../content/site";
import { useTheme } from "../lib/theme";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const reduce = useReducedMotion();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-3 md:px-8">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-[1400px] items-center justify-between rounded-full border border-line bg-surface/75 pl-5 pr-2 backdrop-blur-xl"
      >
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          {site.name}
        </a>

        <ul className="hidden items-center gap-7 text-sm md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-muted transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/10 active:scale-[0.96]"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            href="#booking"
            className="hidden h-10 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-transform active:scale-[0.98] sm:inline-flex"
          >
            Check availability
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/10 md:hidden"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-[1400px] rounded-[20px] border border-line bg-surface p-2 md:hidden"
          >
            {[...navLinks, { href: "#booking", label: "Check availability" }].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[12px] px-4 py-3 text-base hover:bg-ink/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
