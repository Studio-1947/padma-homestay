# Padma Homestay

Website for Padma Homestay, a family-run homestay in the Himalayan hills.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, Three.js (React Three Fiber) and Motion.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check and production build into dist/
npm run preview  # serve the production build
```

## Edit the content

All text, rooms, prices and contact details live in `src/content/site.ts`.
Values marked `SAMPLE` are placeholders. Replace them, then set `isSample` to `false`.

## Add photos

Drop JPG files into `public/images/` using the file names listed in
`public/images/README.md`. Empty slots show a random placeholder photo.

## Project layout

- `src/components/` page sections (Hero, ParallaxView, Rooms, Stay, Day, Booking)
- `src/three/` 3D scenes: mountain range and lotus (hero), prayer flags (stay section)
- `src/content/site.ts` site content
- `src/index.css` design tokens for light and dark mode
