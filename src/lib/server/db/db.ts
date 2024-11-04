import { env } from '$env/dynamic/private';
// import type { ExecutedQuery } from '@planetscale/database';
import type { Person } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const supabaseUrl = 'https://kyyeruyisvmpntjezwlw.supabase.co';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const cloudFrontUrl = 'https://d1deenjh0g4q0v.cloudfront.net';

// const config = {
// 	host: env.PLANETSCALE_DB_HOST,
// 	username: env.PLANETSCALE_DB_DEV_USERNAME,
// 	password: env.PLANETSCALE_DB_DEV_PASSWORD
// };

export class Database {
	// private static connection: Connection;
	private static instance: Database;
	private static client: SupabaseClient;
	private static s3Client: S3Client;

	private constructor() {
		// connect to database
		// Database.connection = connect(config);
		Database.client = createClient(supabaseUrl, supabaseKey!);
		Database.s3Client = new S3Client({
			region: 'us-west-1',
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY
			}
		});
		return Database.instance;
	}

	public static connect() {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	public static getClient() {
		return Database.client;
	}

	public static getS3Client() {
		return Database.s3Client;
	}
	// // eslint-disable-next-line @typescript-eslint/no-explicit-any
	// private static async query(sql: string, values: any): Promise<ExecutedQuery> {
	// 	const res = await Database.connection.execute(sql, values);
	// 	return res;
	// }

	public async getAllPerson() {
		return await Database.client.from('person').select('*');
	}

	public async getPersonById(id: string) {
		return await Database.client.from('person').select('*').eq('id', id);
		//  Database.query('SELECT * FROM person WHERE id = ?;', [id]);
	}

	public async getPersonByUsername(username: string) {
		username = username.toLowerCase();
		return await Database.client.from('person').select('*').eq('username', username);
		// return Database.query('SELECT * FROM person WHERE username = ?;', [username]);
	}

	public async createPerson({
		given_name,
		family_name,
		preferred_name,
		country,
		profile_photo_id,
		blurb,
		username,
		social_media_handles,
		birthdate
	}: Person) {
		username = username.toLowerCase();

		return Database.client.from('person').insert({
			given_name: given_name,
			family_name: family_name,
			preferred_name: preferred_name,
			country,
			profile_photo_id: profile_photo_id,
			blurb: blurb,
			username: username,
			social_media_handles: social_media_handles,
			birthdate
		});

		// return await Database.query(
		// 	'INSERT INTO person (given_name, family_name, preferred_name, country_id, profile_photo_id, blurb, username, instagram_handle, tiktok_handle, birthdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
		// 	[
		// 		given_name,
		// 		family_name,
		// 		preferred_name,
		// 		country_id,
		// 		profile_photo_id,
		// 		blurb,
		// 		username,
		// 		instagram_handle,
		// 		tiktok_handle,
		// 		birthdate
		// 	]
		// );
	}

	public async personExists(username: string) {
		username = username.toLowerCase();
		const res = await Database.client.from('person').select('*').eq('username', username);
		return res.data && res.data.length > 0;
	}
	public async insertShadowPerson(username: string, id: string) {
		username = username.toLowerCase();
		return await Database.client.from('person').insert({ username: username, id: id });
	}
	public async getPersonEmail(username: string) {
		username = username.toLowerCase();
		const res = await Database.client.from('person').select('id').eq('username', username);
		console.log('res', res);
		if (!res.data || res.data.length === 0) {
			return null;
		}
		console.log('res', res);
		const { error, data } = await Database.client.auth.admin.getUserById(res.data![0].id);
		if (error) {
			return null;
		}
		return data.user.email;
	}

	public async updatePerson(id: string, p: Partial<Person>) {
		if (p.username) p.username = p.username.toLowerCase();

		return await Database.client.from('person').update(p).eq('id', id);
	}

	public async getPersonByGivenOrFamilyOrPreferredName(name: string) {
		return await Database.client
			.from('person')
			.select('*')
			.or(`given_name.eq.${name},family_name.eq.${name},preferred_name.eq.${name}`);

		// return (await Database.query(
		// 	'SELECT * FROM person WHERE given_name = ? OR family_name = ? OR preferred_name = ?;',
		// 	[name, name, name]
		// )) as ExecutedQuery<Person>;
	}

	public async getPersonByGivenAndFamilyName(givenName: string, familyName: string) {
		return await Database.client
			.from('person')
			.select('*')
			.eq('given_name', givenName)
			.eq('family_name', familyName);
		// return (await Database.query('SELECT * FROM person WHERE given_name = ? AND family_name = ?;', [
		// 	givenName,
		// 	familyName
		// ])) as ExecutedQuery<Person>;
	}

	public async getPersonByPreferredName(name: string) {
		return await Database.client.from('person').select('*').eq('preferred_name', name);

		// return (await Database.query('SELECT * FROM person WHERE preferred_name = ?;', [
		// 	name
		// ])) as ExecutedQuery<Person>;
	}

	public getProfilePhotoById(id: string): string {
		return cloudFrontUrl + '/' + id;
	}

	public async deleteProfilePhoto(photo_id: string, id: string) {
		const deleteObject = new DeleteObjectCommand({
			Bucket: 'you-exist-pfp',
			Key: photo_id
		});
		try {
			const res = await Database.s3Client.send(deleteObject);
			console.log('res delete', photo_id, res);
			const db_res = Database.client.from('person').update({ profile_photo_id: null }).eq('id', id);
			return db_res;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
	public async uploadProfilePhoto(id: string, file: File, image_id: string) {
		const asArray = await file.arrayBuffer();
		const s = sharp(asArray, { failOnError: false });
		const converted = new Uint8Array(await s.rotate().resize(400, 400).toFormat('jpeg').toBuffer());
		const putobject = new PutObjectCommand({
			Bucket: 'you-exist-pfp',
			Key: image_id + '.jpeg',
			Body: converted,
			ACL: 'public-read'
		});
		console.log('putobject', putobject);
		try {
			const res = await Database.s3Client.send(putobject);
			console.log('res upload', res);

			const db_res = await Database.client
				.from('person')
				.update({ profile_photo_id: image_id })
				.eq('id', id);
			if (db_res.error) {
				throw db_res.error;
			}
			return { error: null, image_id: image_id };
		} catch (err) {
			console.error(err);
			return { error: err, image_id: undefined };
		}
	}
}
