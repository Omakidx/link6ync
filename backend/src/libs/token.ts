import jwt from "jsonwebtoken";

export const createAccessToken = (userId: string, role: "user" | "admin", tokenVersion: number) => {
  const payload = { sub: userId, role, tokenVersion };

  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: "30m",
  });
};

export const createRefreshToken = (userId: string, role: "user" | "admin", tokenVersion: number) => {
  const payload = { sub: userId, role, tokenVersion };

  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!) as {
    sub: string;
    tokenVersion: number;
  };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as {
    sub: string;
    role: "user" | "admin";
    tokenVersion: number;
  };
};
