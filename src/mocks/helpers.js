import * as jose from "jose";
import { HttpResponse } from "msw";
import { getItem, setItem } from "../lib/localStorage";
import { jwtSecret, refreshTokenSecret } from "../lib/constants";

const { VITE_USE_AUTH, VITE_DB_KEY } = import.meta.env;

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDatabaseTable = (entity) => {
  const db = getItem(VITE_DB_KEY);
  const baseData = db?.[entity] ?? [];

  const context = {
    data: baseData,
    db,
    populate(fields) {
      if (!Array.isArray(this.data)) return this;

      this.data = this.data.map((item) => {
        const populatedItem = { ...item };

        for (const field of Array.isArray(fields) ? fields : [fields]) {
          const refValue = item[field];
          if (!this.db?.[field]) continue;
          const refTable = this.db[field];
          if (Array.isArray(refValue)) {
            populatedItem[field] = refValue.map(
              (id) => refTable.find((refItem) => refItem.id === id) ?? id
            );
          } else {
            populatedItem[field] =
              refTable.find((refItem) => refItem.id === refValue) ?? refValue;
          }
        }
        return populatedItem;
      });
      return this;
    },
    exec() {
      return this.data;
    },
  };

  return context;
};

export const withAuth = (...handlers) => {
  return async (config) => {
    const authHeader = config.request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (import.meta.env.VITE_USE_AUTH && !token) {
      return new HttpResponse(null, { status: 401 });
    }

    try {
      const verified = await verifyToken(token, jwtSecret, {
        returnPayload: true,
      });

      if (!verified) {
        const refreshToken = config.request.headers.get("X-Refresh-Token");
        if (refreshToken) {
          const users = getDatabaseTable("users").exec();
          const user = users.find((u) => u.refreshToken === refreshToken);

          if (user) {
            const refreshValid = await verifyToken(
              refreshToken,
              refreshTokenSecret
            );
            if (refreshValid) {
              const newAccessToken = await createToken(
                {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                },
                "15m"
              );

              const newRefreshToken = await createRefreshToken(
                { id: user.id },
                "7d"
              );

              user.refreshToken = newRefreshToken;
              setItem(import.meta.env.VITE_DB_KEY, "users", users);

              const response = await handlers[0](config);
              response.headers.set("New-Access-Token", newAccessToken);
              response.headers.set("New-Refresh-Token", newRefreshToken);
              return response;
            }
          }
        }
        return new HttpResponse(null, { status: 401 });
      }

      return typeof handlers[0] === "function" ? handlers[0](config) : handlers;
    } catch (error) {
      console.error("Authentication error:", error);
      return new HttpResponse(
        JSON.stringify({ message: "Authentication failed" }),
        { status: 401 }
      );
    }
  };
};

export const verifyToken = async (token, secret, options = {}) => {
  if (!token) return false;

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return options.returnPayload ? payload : true;
  } catch (err) {
    if (err.code === "ERR_JWT_EXPIRED") {
      console.warn("Token expired");
      return options.returnPayload ? null : false;
    }
    console.error("Token verification error:", err);
    return false;
  }
};

export const createToken = async (payload, expiresIn = "15m") => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(jwtSecret);
};

export const createRefreshToken = async (payload, expiresIn = "7d") => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(refreshTokenSecret);
};
