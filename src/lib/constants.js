import bcrypt from "bcryptjs";

export const salt = bcrypt.genSaltSync(10);

export const jwtSecret = new TextEncoder().encode(
  import.meta.env.VITE_JWT_SECRET || "your-secret-key-here"
);
export const refreshTokenSecret = new TextEncoder().encode(
  import.meta.env.VITE_REFRESH_SECRET || "your-refresh-secret-key-here"
);
