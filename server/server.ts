import express, { Request, Response } from 'express';
import { AUTH_COOKIE_KEY, SERVER_HOST, SERVER_PORT } from '../common/constants';
import { ACCESS_TOKEN, requireAuth } from './auth';
import { items } from './data';
import cookieParser from 'cookie-parser';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './schema';
import cors from 'cors';

const app = express();

app.use(cors({ origin: ['https://studio.apollographql.com'], credentials: true }))
app.use(cookieParser());

app.post('/login', (_: Request, res: Response) => {
  res.cookie(AUTH_COOKIE_KEY, ACCESS_TOKEN, {
    httpOnly: true,
  });

  res.sendStatus(200);
});

app.post('/logout', (_: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_KEY);

  res.sendStatus(200);
});

app.all('/graphql', requireAuth, createHandler({ schema }));

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server listening on port http://${SERVER_HOST}:${SERVER_PORT}`);
});
