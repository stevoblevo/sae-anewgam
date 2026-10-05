/** Public X posts as talking chart-bubbles. Family stays sieved. */
export type PublicPost = {
  id: string;
  room: string;
  line: string;
  href: string;
  plate: string;
  live?: boolean;
};

export type PostsFile = {
  v: string;
  from: string;
  allow: string;
  talk: boolean;
  display: string;
  sieve: string[];
  authorityEffect: string;
  posts: PublicPost[];
};

export const POSTS_EMPTY: PostsFile = {
  v: "posts/0.1",
  from: "Stevoblevo",
  allow: "public",
  talk: true,
  display: "chart-bubble",
  sieve: ["family", "private-polylite", "kids-mod"],
  authorityEffect: "none",
  posts: [],
};

export function parsePosts(raw: unknown): PostsFile {
  if (!raw || typeof raw !== "object") return POSTS_EMPTY;
  const data = raw as Partial<PostsFile>;
  const posts = Array.isArray(data.posts)
    ? data.posts.filter((p): p is PublicPost => !!p && typeof p.id === "string" && typeof p.line === "string" && typeof p.plate === "string")
    : [];
  return {
    ...POSTS_EMPTY,
    ...data,
    posts,
    talk: data.talk !== false,
    authorityEffect: "none",
  };
}

export async function loadPosts(url = "/posts.json") {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return POSTS_EMPTY;
    return parsePosts(await res.json());
  } catch {
    return POSTS_EMPTY;
  }
}

export function livePosts(file: PostsFile) {
  return file.talk ? file.posts.filter((p) => p.live !== false) : [];
}

export function talkFor(plateId: string, file: PostsFile) {
  return livePosts(file).find((p) => p.plate === plateId || p.room === plateId) ?? null;
}

export function speakLine(line: string) {
  if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") return;
  const text = line.trim();
  if (!text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  const emily = window.speechSynthesis.getVoices().find((v) => /emily/i.test(v.name));
  if (emily) utterance.voice = emily;
  window.speechSynthesis.speak(utterance);
}

export async function loadPosts(url = "/posts.json") {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return POSTS_EMPTY;
    return parsePosts(await res.json());
  } catch {
    return POSTS_EMPTY;
  }
}
