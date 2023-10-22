import { randomBytes } from 'crypto';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const JWT_SECRET = "815c18174901c00ebd3d74cbfa13c620f8507d4f99ac60160778f39d6be400646f6ebaf257d1e93752af880237d66975f5782efae7329db5eb05dbb59b6f625d467144b28cc7391d0b446e900b0d6cfc0d76d3a6d78ff8682fafbd2b6a533f34c6aef7970bb858b68a419b66e25d0d8545656f4fadef47406c7b3ecb92846e000756d9c00cd6df1a352283fc14711cb1f8866734d8849d14dcfa8045275140253a3e8823ac5f62435d44c68907f94e894a5080c09ea198401685b7216ff16a399d2a9f18019f9e961e41ace0808e4299a47f71f29be82e5a5d2ed3a9a19d8962328fa6157b846ff38ed87b9da3c45f9d4baefee366d3856bda6db00c5c66ea86";

export function generateAccessToken(userId: string) {
    return sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyAccessToken(token: string) {
    return verify(token, JWT_SECRET);
}