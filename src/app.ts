// dependencies
import express, { Express, Response, NextFunction, Request } from 'express';
import { resolve } from 'path';

// Env variables setup
require('dotenv').config({ path: resolve(`${__dirname}/../.env.example`) });

// scripts
import api from './api';

const app: Express = express();

// cors
function access(_: Request, res: Response, next: NextFunction): void {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

// middlewares
app.use(access);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use(api.teachers);

export default app;
