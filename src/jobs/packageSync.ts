import { getPackages } from '../services/airalo/packages';
import { getDb } from '../db/database';
import { AiraloListResponse, AiraloPackage } from '../types/airalo';

type Logger = {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string, err?: unknown): void;
};

/**
 * Fetches all packages from Airalo (handling pagination) and upserts them
 * into the local SQLite packages table.
 */
export async function syncPackages(log: Logger): Promise<void> {
  log.info('📦 Package sync started');

  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO packages (id, data, synced_at)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      data      = excluded.data,
      synced_at = excluded.synced_at
  `);

  const insertBatch = db.transaction((packages: AiraloPackage[], now: string) => {
    for (const pkg of packages) {
      upsert.run(pkg.id, JSON.stringify(pkg), now);
    }
  });

  let page = 1;
  let totalUpserted = 0;

  // Paginate through all pages until there are no more results
  while (true) {
    const response = (await getPackages(undefined, page)) as AiraloListResponse<AiraloPackage>;
    const packages = response.data ?? [];

    if (packages.length === 0) break;

    const now = new Date().toISOString();
    insertBatch(packages, now);
    totalUpserted += packages.length;

    const { current_page, last_page } = response.meta ?? {};
    if (!last_page || current_page >= last_page) break;

    page += 1;
  }

  log.info(`📦 Package sync complete — ${totalUpserted} packages upserted`);
}

/**
 * Starts the periodic package sync. Runs once immediately on boot, then
 * repeats every `intervalMs` milliseconds.
 *
 * Returns the timer handle so callers can clear it during graceful shutdown.
 */
export function startPackageSync(intervalMs: number, log: Logger): NodeJS.Timeout {
  const minutes = Math.round(intervalMs / 60_000);
  const display = minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes}m`;
  log.info(`📦 Package sync scheduled every ${display}`);

  // Fire immediately so the DB is populated as soon as the server boots
  syncPackages(log).catch((err) => log.error('Package sync failed', err));

  return setInterval(() => {
    syncPackages(log).catch((err) => log.error('Package sync failed', err));
  }, intervalMs);
}
