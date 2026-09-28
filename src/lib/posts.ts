/** Public @Stevoblevo posts only. Chart-bubble. Talking is fine. */
export type PublicPost = {
  id: string;
  room: string;
  line: string;
  href: string;
  plate: string;
  live?: boolean;
};

export const POSTS: PublicPost[] = [
  {
    id: "2103955067225116907",
    room: "peach",
    line: "a tale about time and friendship",
    href: "https://x.com/Stevoblevo/status/2103955067225116907",
    plate: "peachfall",
  },
  {
    id: "2101586645493399994",
    room: "reign",
    line: "peachfall leads to red reign",
    href: "https://x.com/Stevoblevo/status/2101586645493399994",
    plate: "weather",
  },
  {
    id: "2099365811706048682",
    room: "kk",
    line: "breakfast beskar. Dora soul. skein doll.",
    href: "https://x.com/Stevoblevo/status/2099365811706048682",
    plate: "loom",
  },
];

export function postsFor(room: string) {
  return POSTS.filter((p) => p.room === room);
}

export function talkLine(line: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(line);
  utterance.rate = 0.92;
  const emily = window.speechSynthesis.getVoices().find((v) => /emily/i.test(v.name));
  if (emily) utterance.voice = emily;
  window.speechSynthesis.speak(utterance);
}
