import { useId, useState, type FormEvent, type ReactNode } from "react";
import { EnvelopeSimple, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { site } from "../content/site";
import { Reveal } from "./Reveal";

type Fields = {
  name: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  room: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", checkIn: "", checkOut: "", guests: "2", room: "Any room", message: "" };
const MAX_GUESTS = 8;

const today = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Please tell us your name.";
  if (!fields.checkIn) errors.checkIn = "Choose an arrival date.";
  if (!fields.checkOut) errors.checkOut = "Choose a departure date.";
  else if (fields.checkIn && fields.checkOut <= fields.checkIn) errors.checkOut = "Departure must be after arrival.";
  const guests = Number(fields.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS)
    errors.guests = `Enter between 1 and ${MAX_GUESTS} guests.`;
  return errors;
}

function buildMessage(fields: Fields): string {
  const lines = [
    `Hello ${site.name}, I would like to ask about a stay.`,
    `Name: ${fields.name.trim()}`,
    `Arrival: ${formatDate(fields.checkIn)}`,
    `Departure: ${formatDate(fields.checkOut)}`,
    `Guests: ${fields.guests}`,
    `Room: ${fields.room}`,
  ];
  if (fields.message.trim()) lines.push(`Note: ${fields.message.trim()}`);
  return lines.join("\n");
}

const inputClass =
  "h-12 w-full rounded-[12px] border border-ink/25 bg-surface px-4 text-ink outline-none transition-colors placeholder:text-muted focus:border-accent aria-[invalid=true]:border-accent";

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}
      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

export function Booking() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const set = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSentUrl(null);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const url = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(buildMessage(fields))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  return (
    <section id="booking" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
      <div className="grid grid-cols-1 gap-12 rounded-[20px] bg-surface-2 p-6 md:grid-cols-[1fr_1.15fr] md:gap-16 md:p-14">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
            {site.booking.headline}
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-muted">{site.booking.body}</p>

          <ul className="mt-10 space-y-4">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-3 hover:text-accent">
                <Phone size={20} className="text-accent" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-accent">
                <EnvelopeSimple size={20} className="text-accent" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-accent"
              >
                <MapPin size={20} className="shrink-0 text-accent" />
                {site.address}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Your name" error={errors.name} className="sm:col-span-2">
              {(props) => (
                <input {...props} type="text" autoComplete="name" value={fields.name} onChange={set("name")} className={inputClass} />
              )}
            </Field>

            <Field label="Arrival" error={errors.checkIn}>
              {(props) => (
                <input {...props} type="date" min={today()} value={fields.checkIn} onChange={set("checkIn")} className={inputClass} />
              )}
            </Field>

            <Field label="Departure" error={errors.checkOut}>
              {(props) => (
                <input
                  {...props}
                  type="date"
                  min={fields.checkIn || today()}
                  value={fields.checkOut}
                  onChange={set("checkOut")}
                  className={inputClass}
                />
              )}
            </Field>

            <Field label="Guests" error={errors.guests}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_GUESTS}
                  value={fields.guests}
                  onChange={set("guests")}
                  className={inputClass}
                />
              )}
            </Field>

            <Field label="Room">
              {(props) => (
                <select {...props} value={fields.room} onChange={set("room")} className={inputClass}>
                  <option>Any room</option>
                  {site.rooms.items.map((room) => (
                    <option key={room.id}>{room.name}</option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Anything we should know? (optional)" className="sm:col-span-2">
              {(props) => (
                <textarea
                  {...props}
                  rows={3}
                  value={fields.message}
                  onChange={set("message")}
                  className={`${inputClass} h-auto py-3`}
                />
              )}
            </Field>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 font-medium text-accent-ink transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <WhatsappLogo size={20} weight="fill" />
                Send on WhatsApp
              </button>
              <p aria-live="polite" className="mt-4 min-h-6 text-sm text-muted">
                {sentUrl && (
                  <>
                    WhatsApp opened in a new tab with your message ready to send.{" "}
                    <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline">
                      Open it again
                    </a>
                  </>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
