import { RegistrationParsed } from "@passwordless-id/webauthn/dist/esm/types";
import { JsonDB, Config } from 'node-json-db';

interface RegisterUser {
    username: string;
    email: string;
    registration: RegistrationParsed['credential'];
}

interface User {
    username: string;
    email: string;
    credentials: RegistrationParsed['credential'][];
}

const db = new JsonDB(new Config("u2fdb", true, false, '/'));

export async function registerUser(user: RegisterUser) {
    if (await db.exists(`/users/${user.username}`)) {
        // case of multiple credentials kept for the same user
        await addCredentialsToUser(user.username, user.registration);
    }
    await db.push(`/users/${user.username}`,{...user, credentials: [user.registration] } satisfies User, true);
}

export async function getUserByUsername(username: string) {
    return await db.getData(`/users/${username}`) as User;
}

export async function getUserByCredentials(credential: string) {
    const users = await db.getData(`/users`) as Record<string, User>;
    const user = Object.values(users).find((u) => u.credentials.find((c) => c.id === credential));
    
    if (!user) {
        throw new Error('User not found');
    }
    
    return {
        user : user,
        credential: user?.credentials.find((c) => c.id === credential)!
    }
}


async function addCredentialsToUser(username: string, credentials: RegistrationParsed['credential']) {
    const user = await db.getData(`/users/${username}`) as User;
    user.credentials.push(credentials);
    db.push(`/users/${username}`, user, true);
}