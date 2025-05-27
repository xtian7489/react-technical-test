import { delay, http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";
import { createToken, getDatabaseTable, withAuth } from "../helpers";
import { setItem } from "../../lib/localStorage";
import bcrypt from "bcryptjs";
import { salt } from "../../lib/constants";
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

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userReturned } = user;

    return HttpResponse.json({ token, user: userReturned });
  }),
  http.get(
    "/api/users/me",
    withAuth(async () => {
      await delay(1000);
      const users = getDatabaseTable("users").exec();

      return HttpResponse.json(users);
    })
  ),
  http.post("/api/auth/signup", async ({ request }) => {
    await delay(1000);
    const body = await request.json();
    const users = getDatabaseTable("users").exec();

    const user = users.find((user) => user.email === body.email);
    if (user) {
      return HttpResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }
    const newUser = {
      id: uuidv4(),
      email: body.email,
      role: "user",
    };
    bcrypt.hash(body.password, salt, function (err, hash) {
      newUser.password = hash;
      users.push(newUser);
      setItem(VITE_DB_KEY, "users", users);
    });

    if (newUser) {
      return HttpResponse.json({ user: newUser });
    } else {
      return new HttpResponse(null, { status: 401 });
    }
  }),
];
