import { Response, Request, NextFunction } from "express";
import { AUTH_COOKIE_KEY } from "../common/constants";

export const ACCESS_TOKEN = 'c2b92af1-934c-4d9e-adfe-b5c8da350f58';

export const requireAuth = (req: Request, res:Response, next: NextFunction) => {
  const token = req.cookies[AUTH_COOKIE_KEY];

  if (token === ACCESS_TOKEN) {
    next();
  } else {
    res.sendStatus(403)
  }
}