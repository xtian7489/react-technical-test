import { delay, http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";
import {
  createToken,
  createRefreshToken,
  verifyToken,
  getDatabaseTable,
  withAuth,
} from "../helpers";
import { setItem } from "../../lib/localStorage";
import bcrypt from "bcryptjs";
import { salt, jwtSecret, refreshTokenSecret } from "../../lib/constants";
const { VITE_DB_KEY } = import.meta.env;

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    await delay(1000);
    const { email, password } = await request.json();

    const users = getDatabaseTable("users").exec();
    const user = users.find((user) => user.email === email);

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const accessToken = await createToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "15m"
    );

    const refreshToken = await createRefreshToken(
      {
        id: user.id,
      },
      "7d"
    );

    user.refreshToken = refreshToken;
    setItem(VITE_DB_KEY, "users", users);

    const { password: _, refreshToken: rt, ...userReturned } = user;

    return HttpResponse.json({
      accessToken,
      refreshToken,
      user: userReturned,
    });
  }),

  http.post("/api/auth/refresh", async ({ request }) => {
    await delay(500);
    const { refreshToken } = await request.json();

    const users = getDatabaseTable("users").exec();
    const user = users.find((user) => user.refreshToken === refreshToken);

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid refresh token" },
        { status: 403 }
      );
    }

    try {
      const decoded = await verifyToken(refreshToken, refreshTokenSecret, {
        returnPayload: true,
      });

      if (!decoded || decoded.id !== user.id) {
        throw new Error("Invalid token");
      }

      const newAccessToken = await createToken(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        "15m"
      );

      const newRefreshToken = await createRefreshToken(
        {
          id: user.id,
        },
        "7d"
      );

      user.refreshToken = newRefreshToken;
      setItem(VITE_DB_KEY, "users", users);

      return HttpResponse.json({
        accessToken: newAccessToken,
        newRefreshToken: newRefreshToken,
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return HttpResponse.json(
        { message: "Invalid refresh token" },
        { status: 403 }
      );
    }
  }),

  http.post(
    "/api/auth/logout",
    withAuth(async ({ request }) => {
      await delay(300);
      const users = getDatabaseTable("users").exec();
      const authHeader = request.headers.get("Authorization");
      const token = authHeader.split(" ")[1];

      try {
        const decoded = await verifyToken(token, jwtSecret, {
          returnPayload: true,
        });
        const user = users.find((user) => user.id === decoded.id);

        if (user) {
          user.refreshToken = null;
          setItem(VITE_DB_KEY, "users", users);
        }

        return HttpResponse.json({ success: true });
      } catch (error) {
        return HttpResponse.json({ message: "Logout failed" }, { status: 500 });
      }
    })
  ),

  http.get(
    "/api/users/me",
    withAuth(async ({ request }) => {
      await delay(1000);
      const authHeader = request.headers.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decoded = await verifyToken(token, jwtSecret, {
        returnPayload: true,
      });

      const users = getDatabaseTable("users").exec();
      const user = users.find((u) => u.id === decoded.id);

      if (!user) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const { password, refreshToken, ...userData } = user;
      return HttpResponse.json(userData);
    })
  ),

  http.post("/api/auth/signup", async ({ request }) => {
    await delay(1000);
    const body = await request.json();
    const users = getDatabaseTable("users").exec();

    const userExists = users.some((user) => user.email === body.email);
    if (userExists) {
      return HttpResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, salt);
    const newUser = {
      id: uuidv4(),
      email: body.email,
      password: hashedPassword,
      role: "user",
      refreshToken: null,
    };

    users.push(newUser);
    setItem(VITE_DB_KEY, "users", users);

    const { password, refreshToken, ...userReturned } = newUser;
    return HttpResponse.json({ user: userReturned });
  }),
];
