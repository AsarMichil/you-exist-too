import { Database } from './db';

export const db = Database.connect();
export const client = Database.getClient();
