import Fastify from "fastify";
import { consumeNounce, generateNounce } from "./nounces.js";
import cors from "@fastify/cors";
import { server } from "@passwordless-id/webauthn";
import { AuthenticationEncoded, RegistrationEncoded } from "@passwordless-id/webauthn/dist/esm/types.js";
import { getUserByCredentials as getUserByCredentialId, getUserByUsername, registerUser } from "./database.js";
import { generateAccessToken, verifyAccessToken } from "./jwt.js";
import { JwtPayload } from "jsonwebtoken";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: true,
});

fastify.get("/auth-challenge", (request, reply) => {
  reply.send({ nounce: generateNounce() });
});

interface RegistrationBody {
  registration: RegistrationEncoded;
  userData: {
    username: string;
    email: string;
  };
  nounce: string;
}

fastify.post("/register", async (request, reply) => {
  const body = request.body as RegistrationBody;
  const registration = body.registration;

  if (!consumeNounce(body.nounce)) {
    reply.status(400).send({ error: "Invalid nounce" });
    return;
  }

  const registrationParsed = await server.verifyRegistration(registration, {
    challenge: body.nounce,
    origin: "http://localhost:4200",
  });

  await registerUser({
    username: body.userData.username,
    email: body.userData.email,
    registration: registrationParsed.credential,
  });

  reply.send({ ok: true });
});

interface LoginParams {
  username: string;
}

fastify.get("/login-challenge/:username", async (request, reply) => {
  const { username } = request.params as LoginParams;
  const user = await getUserByUsername(username);
  
  reply.send({ 
    nounce: generateNounce(), 
    authenticators: user.credentials.map((a) => a.id) 
   });
});

interface LoginBody {
    authentication: AuthenticationEncoded,
    nounce: string
  }

fastify.post("/login", async (request, reply) => {
    const body = request.body as LoginBody;

    if (!consumeNounce(body.nounce)) {
        reply.status(400).send({ error: "Invalid nounce" });
        return;
    }
    
    const {credential,user} = await getUserByCredentialId(body.authentication.credentialId);
    

    await server.verifyAuthentication(body.authentication, credential, {
        challenge: body.nounce,
        origin: "http://localhost:4200",
        userVerified: false,
        counter: 0
    });
    
    reply.send({ accessToken: generateAccessToken(user.username) });
});

fastify.get('/profile', async (request, reply) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        reply.status(401).send({ error: 'Unauthorized' });
        return;
    }

    const { id } = verifyAccessToken(token) as JwtPayload;

    const user = await getUserByUsername(id);
    
    reply.send({ 
        username: user.username,
        email: user.email
    });
});

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
