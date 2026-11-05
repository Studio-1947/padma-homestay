# Photo slots

Drop your photos in this folder using these exact file names (JPG unless noted). Until a
file exists, the site shows a stand-in photo in that slot.

| File            | Where it appears                          | Suggested size |
| --------------- | ----------------------------------------- | -------------- |
| `dhotrey-layer-back.webp`, `-middle.webp`, `-front.webp` | Hero parallax layers, cut from `dhotrey.jpeg` by depth | 2400 wide |
| `ridge-morning.webp`, `ridge-evening.webp`, `ridge-night.webp` | "The ridge changes every hour" time lapse. Same framing in all three, upscaled 2x from `morning.png`, `evening.png`, `night.png` (night moved up 9 px to line up) | 2990 x 2104 |
| `rooms/1.webp` to `rooms/13.webp` | Rooms section. The old site's room photos (`assets-src/old-site-rooms`), upscaled 2x. Which photo belongs to which room is set in `src/content/site.ts` | 2000 x 1000 |
| `food/*.webp`   | Kitchen section: spread, kitchen, dishes (real photos, upscaled 2x) and menu plates breakfast, veg-thali, egg-thali, chicken-thali. Originals in assets-src/food | as supplied |
| `property/*.webp` | Gallery (A look around): the house, rooms, dining room and views. Upscaled 2x; originals in assets-src/property | as supplied |
| `nearby/*.webp` | Around Dhotrey cards. Real photos from Wikimedia Commons under free licences; the credit shown on each card is required. Credits live in `src/content/site.ts` | 900 x 1100 |

Gallery photos can be any shape: change `width` and `height` for that photo in
`src/content/site.ts` to match the real file, and the wall rearranges itself.

Keep each file under about 400 KB so the page stays fast.
