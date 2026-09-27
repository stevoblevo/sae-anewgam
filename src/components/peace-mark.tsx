import { Circle, DoorOpen, Feather, Heart, Moon, Sparkles, Sun } from "lucide-react";
import type { PeaceMark } from "@/lib/bpeace";

const MARKS = {
  sun: Sun,
  moon: Moon,
  heart: Heart,
  feather: Feather,
  spark: Sparkles,
  door: DoorOpen,
  circle: Circle,
} as const;

export function PeaceIcon({ mark }: { mark: PeaceMark }) {
  const Icon = MARKS[mark] ?? Circle;
  return <Icon size={14} strokeWidth={1.6} aria-hidden />;
}
