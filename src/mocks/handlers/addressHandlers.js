import { delay, http, HttpResponse } from "msw";
import { getDatabaseTable, withAuth } from "../helpers";
import { setItem } from "../../lib/localStorage";
import { v4 as uuidv4 } from "uuid";

const { VITE_DB_KEY } = import.meta.env;

export const addressHandlers = [
  http.get(
    "/api/address",
    withAuth(async () => {
      const addresses = getDatabaseTable("address").exec();
      await delay(1000);
      return HttpResponse.json({ addresses });
    })
  ),
  http.put(
    "/api/address/:id",
    withAuth(async ({ request, params }) => {
      const { id } = params;
      const body = await request.json();

      const addresses = getDatabaseTable("address").exec();
      const address = addresses.find((address) => address.id === id);

      if (!address) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const newAddress = {
        id: id,
        ...body,
      };

      const addressIndex = addresses.findIndex((address) => address.id === id);
      if (addressIndex !== -1) {
        addresses[addressIndex] = newAddress;
        setItem(VITE_DB_KEY, "address", addresses);
      } else {
        return HttpResponse.json(
          { message: "Address not found" },
          { status: 404 }
        );
      }
      await delay(1000);
      return HttpResponse.json({ address: newAddress });
    })
  ),
  http.post(
    "/api/address",
    withAuth(async ({ request }) => {
      const body = await request.json();
      const addresses = getDatabaseTable("address").exec();
      const newAddress = {
        id: uuidv4(),
        ...body,
      };
      addresses.push(newAddress);
      setItem(VITE_DB_KEY, "address", addresses);
      await delay(1000);
      return HttpResponse.json(newAddress, { status: 201 });
    })
  ),
  http.delete(
    "/api/address/:id",
    withAuth(async ({ params }) => {
      const { id } = params;
      const addresses = getDatabaseTable("address").exec();
      const addressIndex = addresses.findIndex((address) => address.id === id);
      if (addressIndex === -1) {
        return HttpResponse.json(
          { message: "Address not found" },
          { status: 404 }
        );
      }
      addresses.splice(addressIndex, 1);
      setItem(VITE_DB_KEY, "address", addresses);
      await delay(1000);
      return HttpResponse.json({ message: "Address deleted successfully" });
    })
  ),
];
