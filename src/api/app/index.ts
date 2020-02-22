import { AppUtils } from './types';
import connection from './database';

const AppInterface: AppUtils = {
  database: connection,
};

export default AppInterface;
