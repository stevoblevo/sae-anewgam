let video: HTMLVideoElement | null = null;

export function eyeReady(): boolean {
  return Boolean(video && video.readyState >= 2);
}

export async function allowEye(): Promise<void> {
  if (video) return;
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });
  const el = document.createElement("video");
  el.srcObject = stream;
  el.playsInline = true;
  el.muted = true;
  await el.play();
  video = el;
  localStorage.setItem("sae-eye", "1");
}

export function snapEye(): string | null {
  if (!video || video.readyState < 2) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const side = Math.min(vw, vh);
  ctx.save();
  ctx.translate(480, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, (vw - side) / 2, (vh - side) / 2, side, side, 0, 0, 480, 480);
  ctx.restore();
  return canvas.toDataURL("image/jpeg", 0.72);
}

export async function snapScene(): Promise<string | null> {
  const img = document.querySelector(".rite img, .world, .player-stage img") as HTMLImageElement | null;
  if (!img || !img.complete || !img.naturalWidth) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const scale = Math.max(960 / img.naturalWidth, 540 / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (960 - w) / 2, (540 - h) / 2, w, h);
  return canvas.toDataURL("image/jpeg", 0.72);
}

function load(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

export async function compose(scene: string, face: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");
  if (!ctx) return scene;
  const back = await load(scene);
  const front = await load(face);
  ctx.drawImage(back, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.arc(800, 130, 86, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(front, 714, 44, 172, 172);
  ctx.restore();
  ctx.strokeStyle = "#9ecfb8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(800, 130, 86, 0, Math.PI * 2);
  ctx.stroke();
  return canvas.toDataURL("image/jpeg", 0.8);
}

export type Take = { t: number; before: string; after: string; scene: string; made: string; shown: "before" | "after" };

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("sae-eye", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("takes", { keyPath: "t" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function keepTake(take: Take): Promise<void> {
  const base = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = base.transaction("takes", "readwrite");
    tx.objectStore("takes").put(take);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
