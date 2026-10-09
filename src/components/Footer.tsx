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
      {/* Attribution required by the CC BY 4.0 licence of the hero mountain model. */}
      <p className="mt-6 text-xs text-muted">
        Mountain model:{" "}
        <a
          href="https://sketchfab.com/3d-models/snowy-mountain-terrain-9fa3c56fd32746bcb0e06cd2c4229ca0"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          Snowy Mountain - Terrain
        </a>{" "}
        by artfromheath, licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          CC BY 4.0
        </a>
        .
      </p>
    </footer>
  );
}
