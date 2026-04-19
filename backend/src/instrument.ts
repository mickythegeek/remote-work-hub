import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { unifiedConfig } from "./config/unifiedConfig";

if (unifiedConfig.SENTRY_DSN) {
  Sentry.init({
    dsn: unifiedConfig.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, 
    // Profiling
    profilesSampleRate: 1.0,
  });
  console.log('🛡️  Sentry configured.');
} else {
  console.log('⚠️  SENTRY_DSN not provided in env. Sentry is disabled.');
}
