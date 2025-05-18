import { env } from '$env/dynamic/private';
import type { Database } from '$lib/database.types';
// import type { ExecutedQuery } from '@planetscale/database';
import type { Person } from './types';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = 'https://kyyeruyisvmpntjezwlw.supabase.co';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const cloudFrontUrl = 'https://d1deenjh0g4q0v.cloudfront.net';

// const config = {
// 	host: env.PLANETSCALE_DB_HOST,
// 	username: env.PLANETSCALE_DB_DEV_USERNAME,
// 	password: env.PLANETSCALE_DB_DEV_PASSWORD
// };

export class Server {
	// private static connection: Connection;
	static instance: Server;
	static client: SupabaseClient<Database>;
	static s3Client: S3Client;

	private constructor() {
		// connect to database
		// Database.connection = connect(config);
		Server.client = createClient<Database>(supabaseUrl, supabaseKey!);
		Server.s3Client = new S3Client({
			region: 'us-west-1',
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY
			}
		});
		return Server.instance;
	}

	public static connect() {
		if (!Server.instance) {
			Server.instance = new Server();
		}
		return Server.instance;
	}
	// // eslint-disable-next-line @typescript-eslint/no-explicit-any
	// private static async query(sql: string, values: any): Promise<ExecutedQuery> {
	// 	const res = await Database.connection.execute(sql, values);
	// 	return res;
	// }

	public async getAllPerson() {
		return await Server.client.from('person').select('*');
	}

	public async getPersonById(id: string) {
		return await Server.client.from('person').select('*').eq('id', id);
		//  Database.query('SELECT * FROM person WHERE id = ?;', [id]);
	}

	public async getPersonByUsername(username: string) {
		username = username.toLowerCase();
		return await Server.client.from('person').select('*').eq('username', username);
		// return Database.query('SELECT * FROM person WHERE username = ?;', [username]);
	}

	public async personExists(username: string) {
		username = username.toLowerCase();
		const res = await Server.client.from('person').select('*').eq('username', username);
		return res.data && res.data.length > 0;
	}
	public async insertPersonEntry(username: string, id: string) {
		username = username.toLowerCase();
		return await Server.client.from('person').insert({ username: username, id: id });
	}
	public async getPersonEmail(username: string) {
		username = username.toLowerCase();
		const res = await Server.client.from('person').select('id').eq('username', username);
		if (!res.data || res.data.length === 0) {
			return null;
		}
		const { error, data } = await Server.client.auth.admin.getUserById(res.data![0].id);
		if (error) {
			return null;
		}
		return data.user.email;
	}

	public async updatePerson(id: string, p: Partial<Person>) {
		if (p.username) p.username = p.username.toLowerCase();
		let social_media_handles;
		if (p.social_media_handles) {
			social_media_handles = JSON.stringify(p.social_media_handles);
		}

		return await Server.client
			.from('person')
			.update({
				...p,
				social_media_handles: social_media_handles
			})
			.eq('id', id);
	}

	public async getPersonByGivenOrFamilyOrPreferredName(name: string) {
		return await Server.client
			.from('person')
			.select('*')
			.or(`given_name.eq.${name},family_name.eq.${name},preferred_name.eq.${name}`);

		// return (await Database.query(
		// 	'SELECT * FROM person WHERE given_name = ? OR family_name = ? OR preferred_name = ?;',
		// 	[name, name, name]
		// )) as ExecutedQuery<Person>;
	}

	public async getPersonByGivenAndFamilyName(givenName: string, familyName: string) {
		return await Server.client
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
		return await Server.client.from('person').select('*').eq('preferred_name', name);

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
			await Server.s3Client.send(deleteObject);
			const db_res = Server.client.from('person').update({ profile_photo_id: null }).eq('id', id);
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
		try {
			await Server.s3Client.send(putobject);

			const db_res = await Server.client
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
	public async logIp(ip: string) {
		return await Server.client.from('logs').insert({ ip });
	}

	public async vectorSearchPerson(query: string) {
		return await Server.client.from('person').select('*').textSearch('search_vector', query);
	}
	public async searchPerson(query: string) {
		return await Server.client.rpc('search_person', {
			search_term: query,
			is_autocomplete: false
		});
	}
	public async searchAutocomplete(query: string) {
		return await Server.client.rpc('search_person', {
			search_term: query,
			is_autocomplete: true
		});
	}
}
