import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const imageHostnames = Array.from(
  new Set(
    [
      "vbqvyloridsjwsafwokh.supabase.co",
      supabaseHostname,
    ].filter(Boolean) as string[],
  ),
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
