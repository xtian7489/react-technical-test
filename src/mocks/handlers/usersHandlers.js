import { delay, http, HttpResponse } from "msw";
import { getDatabaseTable, verifyToken, withAuth } from "../helpers";
import { setItem } from "../../lib/localStorage";
import { salt } from "../../lib/constants";
import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcryptjs";

const { VITE_DB_KEY } = import.meta.env;

const userHandlers = [
  http.get(
    "/api/users",
    withAuth(async () => {
      await delay(1000);
      const users = getDatabaseTable("users").exec();

      return HttpResponse.json(users);
    })
  ),

  http.get(
    "/api/users/:id",
    withAuth(async ({ request, params }) => {
      await delay(1000);
      const { id } = params;
      const url = new URL(request.url);
      const include = url.searchParams.get("include");

      const populateFields = include ? include.split(",") : [];
      const users = getDatabaseTable("users").populate(populateFields).exec();
      const user = users.find((user) => user.id === id);
      return HttpResponse.json(user);
    })
  ),

  http.put(
    "/api/users/me/profile",
    withAuth(async ({ request }) => {
      await delay(1000);
      const body = await request.json();
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const userData = await verifyToken(token, { returnPayload: true });
      const users = getDatabaseTable("users").exec();
      const user = users.find((user) => user.id === userData.id);

      if (!user) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const updatedUser = { ...user, ...body };
      const userIndex = users.findIndex((user) => user.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        setItem(VITE_DB_KEY, "users", users);
      } else {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json({ user: updatedUser });
    })
  ),
  http.post(
    "/api/users",
    withAuth(async ({ request }) => {
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
      const newUser = { ...body, id: uuidv4() };
      bcrypt.hash(body.password, salt, function (err, hash) {
        newUser.password = hash;
        users.push(newUser);
        setItem(VITE_DB_KEY, "users", users);
      });
      return HttpResponse.json({ user: newUser });
    })
  ),
  http.put(
    "/api/users/:id",
    withAuth(async ({ request, params }) => {
      const { id } = params;
      const body = await request.json();

      const users = getDatabaseTable("users").exec();
      const user = users.find((user) => user.id === id);
      if (!user) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      const updatedUser = { ...user, ...body };
      const userIndex = users.findIndex((user) => user.id === updatedUser.id);
      if (userIndex !== -1) {
        bcrypt.hash(body.password, salt, function (err, hash) {
          updatedUser.password = hash;

          users[userIndex] = updatedUser;
          setItem(VITE_DB_KEY, "users", users);
        });
      } else {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      await delay(1000);

      const usersTable = getDatabaseTable("users")
        .populate(["studies", "address"])
        .exec();
      const userToReturn = usersTable.find(
        (user) => user.id === updatedUser.id
      );

      return HttpResponse.json({ user: userToReturn });
    })
  ),
  http.put(
    "/api/users/:id/studies",
    withAuth(async ({ request, params }) => {
      const { id } = params;
      const body = await request.json();

      const users = getDatabaseTable("users").exec();
      const user = users.find((user) => user.id === id);
      if (!user) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      user.studies = body.studies || [];
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        users[userIndex] = user;
        setItem(VITE_DB_KEY, "users", users);
      } else {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      await delay(1000);
      return HttpResponse.json({ user });
    })
  ),
  http.post(
    "/api/users/:id/address",
    withAuth(async ({ request, params }) => {
      const { id } = params;
      const body = await request.json();

      const users = getDatabaseTable("users").exec();
      const user = users.find((user) => user.id === id);
      if (!user) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const address = getDatabaseTable("address").exec();
      const newAddress = {
        id: uuidv4(),
        ...body,
      };
      address.push(newAddress);
      setItem(VITE_DB_KEY, "address", address);

      user.address = newAddress.id;

      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        users[userIndex] = user;
        setItem(VITE_DB_KEY, "users", users);
      } else {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      await delay(1000);
      return HttpResponse.json({ user });
    })
  ),

  http.delete(
    "/api/users/:id",
    withAuth(async ({ params }) => {
      const { id } = params;

      const users = getDatabaseTable("users").exec();
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      users.splice(userIndex, 1);
      setItem(VITE_DB_KEY, "users", users);
      await delay(1000);
      return HttpResponse.json({ message: "User deleted successfully" });
    })
  ),
];

export default userHandlers;
