// Lets a room card pre-select its room in the booking form further down the page.
const EVENT = "padma:choose-room";

export function chooseRoom(name: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: name }));
}

export function onRoomChosen(callback: (name: string) => void) {
  const listener = (event: Event) => callback((event as CustomEvent<string>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
