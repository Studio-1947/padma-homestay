import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { navLinks, site } from "../content/site";

const heading = "text-sm font-medium text-muted";
const link = "transition-colors hover:text-accent";

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1400px] px-4 pb-10 pt-4 md:px-8">
      <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">{site.name}</p>
          <p className="mt-3 max-w-[32ch] leading-relaxed text-muted">
            A family home with thirteen guest rooms, on the trail into Singalila National Park.
          </p>
        </div>

        {/* Two columns of links on phones fold into the grid from md. */}
        <div>
          <p className={heading}>Explore</p>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>Contact</p>
          <ul className="mt-4 space-y-2.5">
            {[{ display: site.phoneDisplay, href: site.phoneHref }, ...site.otherPhones].map((phone) => (
              <li key={phone.href}>
                <a href={phone.href} className={link}>
                  {phone.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className={heading}>Visit</p>
          <address className="mt-4 not-italic leading-relaxed">{site.address}</address>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2.5 inline-flex items-center gap-1 ${link}`}
          >
            Directions
            <ArrowUpRightIcon size={16} />
          </a>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-muted">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <p>
          Designed by{" "}
          <a
            href="https://www.1947.io"
            target="_blank"
            rel="noopener"
            className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Studio 1947
          </a>
        </p>
      </div>
    </footer>
  );
}
