import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export function signJWT(params: {
  url: string;
  method: string;
  algorithm: 'ES256';
  timestampMs: number;
  jwtExpiresSeconds: number;
  apiPubKey: string;
  apiPrivKey: string;
}): string {
  const {
    url,
    method,
    algorithm,
    timestampMs,
    jwtExpiresSeconds,
    apiPrivKey,
    apiPubKey,
  } = params;

  // Remove https:// but keep the rest
  const urlWithEndpoint = url.slice(8);
  const uri = `${method} ${urlWithEndpoint}`;

  const payload = {
    iss: 'cdp',
    nbf: Math.floor(timestampMs / 1000),
    exp: Math.floor(timestampMs / 1000) + jwtExpiresSeconds,
    sub: apiPubKey,
    uri,
  };

  const header = {
    alg: algorithm,
    kid: apiPubKey,
    nonce: nanoid(16),
  };

  const options: jwt.SignOptions = {
    algorithm: algorithm as jwt.Algorithm,
    header: header,
  };

  return jwt.sign(payload, apiPrivKey, options);
}
