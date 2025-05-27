import * as jose from "jose";
import { HttpResponse } from "msw";
import { getItem } from "../lib/localStorage";

const { VITE_JWT_SECRET, VITE_USE_AUTH, VITE_DB_KEY } = import.meta.env;
const jwtSecret = new TextEncoder().encode(VITE_JWT_SECRET);

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

export const withAuth =
  (...data) =>
  async (config) => {
    const token = config.request.headers.get("Authorization")?.split(" ")[1];

    const verified = token ? await verifyToken(token) : false;

    if (VITE_USE_AUTH && !verified) {
      return new HttpResponse(null, { status: 401 });
    }

    return typeof data[0] === "function" ? data[0](config) : data;
  };

export const verifyToken = async (token, options = {}) => {
  try {
    const { payload } = await jose.jwtVerify(token, jwtSecret);
    return options.returnPayload ? payload : true;
  } catch (err) {
    if (err.code === "ERR_JWT_EXPIRED") {
      console.warn("Token expirado");
      return null;
    }
    console.error("Error verifying token:", err);
    return false;
  }
};

export const createToken = async (payload) => {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(jwtSecret);

  return token;
};
