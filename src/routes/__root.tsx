import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Installable } from "@/components/installable";
import appCss from "../styles.css?url";

const APP_NAME = "Sae · .anewgam";

/** Same host filter as `publicAppHost` in scripts/grok-pwa-shared.mjs. */
function publicAppHost(hostHeader: string | null | undefined): string {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  ) {
    return "";
  }
  return host;
}

/**
 * Same public-host guard as og:image (`resolvePublicHost` in scripts/grok-pwa-shared.mjs).
 * Published hostname wins; otherwise the request host. Empty means not public.
 */
function resolvePublicHost(hostHeader?: string | null): string {
  const fromProcess = typeof process !== "undefined" ? process.env?.VITE_PUBLIC_HOSTNAME : "";
  const fromVite = import.meta.env?.VITE_PUBLIC_HOSTNAME;
  return publicAppHost(fromProcess) || publicAppHost(fromVite) || publicAppHost(hostHeader);
}

const getXBannerHost = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const header = getRequestHeader("x-forwarded-host") || getRequestHeader("host") || "";
    return resolvePublicHost(header);
  } catch {
    return resolvePublicHost("");
  }
});

export const Route = createRootRoute({
  loader: () => getXBannerHost(),
  head: ({ loaderData }) => {
    const host = typeof loaderData === "string" ? loaderData : "";
    const xBanner = host ? `https://${host}/x-banner.jpg` : "";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { title: APP_NAME },
        { name: "theme-color", content: "#f4e6d8" },
        {
          name: "description",
          content: "Sae · .anewgam — garden central · red rain. the way home stays open.",
        },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "apple-mobile-web-app-title", content: APP_NAME },
        ...(xBanner ? [{ property: "x:game:image", content: xBanner }] : []),
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap",
        },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      ],
    };
  },
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <Installable />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
