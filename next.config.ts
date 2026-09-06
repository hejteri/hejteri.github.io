import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isRootGithubPagesSite = repositoryName.endsWith(".github.io");
const hasCustomDomain = fs.existsSync(path.join(process.cwd(), "public", "CNAME"));
const basePath =
  isGithubActions && repositoryName && !isRootGithubPagesSite && !hasCustomDomain
    ? `/${repositoryName}`
    : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
