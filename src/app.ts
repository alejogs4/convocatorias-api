// dependencies
import express, { Express } from 'express';
import { resolve } from 'path';

// Env variables setup
require('dotenv').config({ path: resolve(`${__dirname}/../.env.example`) });

// scripts
import api from './api';

const app: Express = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use(api.teachers);

export default app;
