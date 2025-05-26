import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: Secret,
  expiresIn: number
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};



export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
