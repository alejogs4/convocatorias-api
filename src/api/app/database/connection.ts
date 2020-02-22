// packages
import { Pool } from 'pg';

// scripts
import databaseSetup from './config';

// Database connection object
let connection: Pool | null = null;

/**
 * Verify if connection has been stablished before to instantiate a new pool object
 */
function getDatabaseConnection(): Pool {
  if (!connection) {
    connection = new Pool(databaseSetup);
  }

  return connection;
}

export default getDatabaseConnection;
