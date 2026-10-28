// Secrets the worker reads at runtime (set in Cloudflare, or .dev.vars locally).
declare module 'cloudflare:workers' {
  export const env: {
    LEAD_WEBHOOK_URL?: string;
    LEAD_WEBHOOK_SECRET?: string;
  };
}

interface ImportMetaEnv {
  /** owner/repo for the live CMS (Keystatic GitHub mode). Unset = local editing only. */
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO?: string;
}
