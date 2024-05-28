// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { SupabaseClient, Session, User } from '@supabase/supabase-js';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// user: import("lucia").User | null;
			// session: import("lucia").Session | null;
			supabase: SupabaseClient;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
