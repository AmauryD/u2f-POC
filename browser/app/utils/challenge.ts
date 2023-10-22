export async function getChallenge() {
  // validation pass, get nounce from server
  const response = await fetch('http://localhost:3000/auth-challenge');
  const { nounce } = await response.json();
  return nounce as string;
}

interface LoginChallengeResponse {
  nounce: string;
  authenticators: string[];
}

export async function loginChallenge(user: string) {
  const response = await fetch(`http://localhost:3000/login-challenge/${user}`);
  const { nounce, authenticators } = await response.json();
  return { nounce, authenticators } as LoginChallengeResponse;
}
