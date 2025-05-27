import { addressHandlers } from "./handlers/addressHandlers";
import { authHandlers } from "./handlers/authHandlers";
import studiesHandlers from "./handlers/studiesHandlers";
import userHandlers from "./handlers/usersHandlers";

export const handlers = [
  ...userHandlers,
  ...authHandlers,
  ...studiesHandlers,
  ...addressHandlers,
];
