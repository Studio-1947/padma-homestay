import { navLinks, site } from "../content/site";

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 md:px-8">
      <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">{site.name}</p>
          <p className="mt-1 text-sm text-muted">{site.address}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-muted transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
