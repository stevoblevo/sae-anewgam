import { useEffect, useState } from "react";
import { readForm, type FormId } from "@/lib/forms";

export function FormFit() {
  const [form, setForm] = useState<FormId>("daylight");

  useEffect(() => {
    const paint = () => {
      const next = readForm();
      document.documentElement.dataset.form = next;
      setForm(next);
    };
    paint();
    window.addEventListener("sae-form", paint);
    window.addEventListener("resize", paint);
    return () => {
      window.removeEventListener("sae-form", paint);
      window.removeEventListener("resize", paint);
    };
  }, []);

  return <span className="form-live" hidden>{form}</span>;
}
