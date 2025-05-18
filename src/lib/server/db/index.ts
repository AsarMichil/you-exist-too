import { Server } from './db';

export const db = Server.connect();
export const client = Server.client;
