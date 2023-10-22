import { randomBytes } from "crypto";

const NOUNCE_EXPIRATION = 1000 * 60 * 60; // 1 hour

type Nounce = {
    nounce: string;
    timestamp: number;
}

const nounces = new Map<string, Nounce>();

export function generateNounce() {
  const nounce = randomBytes(32).toString('hex');
  nounces.set(nounce, {
    nounce,
    timestamp: Date.now()
  });
  return nounce;
}

export function consumeNounce(nounce: string) {
  const nounceObj = nounces.get(nounce);
  if (!nounceObj) {
    return false;
  }
  if (nounceObj.timestamp + NOUNCE_EXPIRATION < Date.now()) {
    nounces.delete(nounce);
    return false;
  }
  nounces.delete(nounce);
  return true;
}