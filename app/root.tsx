import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import Toast from "./components/Toast";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", type: "image/png", href: "/logo.png" },
  { rel: "canonical", href: "https://hyper-gro-form-builder.vercel.app/" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HyperGro Forms</title>
        <meta name="description" content="Build custom forms with our intuitive drag-and-drop interface. Add fields, configure settings, and share your forms with others in seconds." />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="HyperGro Forms" />
        <meta property="og:description" content="Build custom forms with our intuitive drag-and-drop interface. Add fields, configure settings, and share your forms with others in seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hyper-gro-form-builder.vercel.app/" />
        <meta property="og:image" content="https://hyper-gro-form-builder.vercel.app/logo.png" />
        <meta property="og:image:type" content="image/png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HyperGro Forms" />
        <meta name="twitter:description" content="Build custom forms with our intuitive drag-and-drop interface. Add fields, configure settings, and share your forms with others in seconds." />
        <meta name="twitter:image" content="https://hyper-gro-form-builder.vercel.app/logo.png" />
        
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HyperGro Forms",
              url: "https://hyper-gro-form-builder.vercel.app/",
            }),
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toast />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
