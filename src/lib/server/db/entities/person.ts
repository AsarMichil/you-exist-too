import type { Person } from '$lib/types/person';
import { Database } from '../db';

export const person = {
	// Get person by ID
	getPersonById: async (id: string) => {
		const { data, error } = await Database.client.from('person').select('*').eq('id', id).single();

		if (error) throw error;
		return data;
	},

	// Get person by username
	getPersonByUsername: async (username: string) => {
		const { data, error } = await Database.client
			.from('person')
			.select('*')
			.eq('username', username.toLowerCase())
			.single();

		if (error) throw error;
		return data;
	},

	// Create new person
	createPerson: async (person: Person) => {
		const { data, error } = await Database.client
			.from('person')
			.insert({
				...person,
				username: person.username.toLowerCase()
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Check if username exists
	personExists: async (username: string) => {
		const { data, error } = await Database.client
			.from('person')
			.select('id')
			.eq('username', username.toLowerCase());

		if (error) throw error;
		return data && data.length > 0;
	},

	// Update person
	updatePerson: async (id: string, person: Partial<Person>) => {
		const { data, error } = await Database.client
			.from('person')
			.update({
				...person,
				username: person.username?.toLowerCase()
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Delete person
	deletePerson: async (id: string) => {
		const { error } = await Database.client.from('person').delete().eq('id', id);

		if (error) throw error;
		return true;
	},

	// Get all persons
	getAllPersons: async () => {
		const { data, error } = await Database.client.from('person').select('*');

		if (error) throw error;
		return data;
	},

	// Search person by name
	getPersonByGivenOrFamilyOrPreferredName: async (name: string) => {
		const { data, error } = await Database.client
			.from('person')
			.select('*')
			.or(`given_name.eq.${name},family_name.eq.${name},preferred_name.eq.${name}`);

		if (error) throw error;
		return data;
	}
};
