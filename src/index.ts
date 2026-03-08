import { buildApp } from './app';
import { env } from './config/env';
import { startPackageSync } from './jobs/packageSync';
import { closeDb } from './db/database';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 cellulo-bff listening on port ${env.PORT}`);

    // Start the background package-sync job
    const syncTimer = startPackageSync(env.PACKAGE_SYNC_INTERVAL_MS, {
      info: (msg) => app.log.info(msg),
      warn: (msg) => app.log.warn(msg),
      error: (msg, err) => app.log.error({ err }, msg),
    });

    // Clean up on graceful shutdown
    const shutdown = async () => {
      clearInterval(syncTimer);
      closeDb();
      await app.close();
      process.exit(0);
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
