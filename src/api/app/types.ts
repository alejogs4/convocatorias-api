import { Pool } from 'pg';

interface AppUtils {
  database: Pool;
}

export { AppUtils };
