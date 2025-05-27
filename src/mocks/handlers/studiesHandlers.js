import { delay, http, HttpResponse } from "msw";
import { getDatabaseTable, withAuth } from "../helpers";
import { setItem } from "../../lib/localStorage";
import { v4 as uuidv4 } from "uuid";

const { VITE_DB_KEY } = import.meta.env;

const studiesHandlers = [
  http.get(
    "/api/studies",
    withAuth(async () => {
      await delay(1000);
      const users = getDatabaseTable("studies").exec();

      return HttpResponse.json(users);
    })
  ),
  http.post(
    "/api/studies",
    withAuth(async ({ request }) => {
      const body = await request.json();
      const newStudy = {
        id: uuidv4(),
        ...body,
      };
      const studies = getDatabaseTable("studies").exec();
      if (studies.some((study) => study.name === newStudy.name)) {
        return HttpResponse.json(
          { error: "Ya existe un estudio con ese nombre." },
          { status: 400 }
        );
      }
      studies.push(newStudy);
      setItem(VITE_DB_KEY, "studies", studies);
      await delay(1000);
      return HttpResponse.json(newStudy, { status: 201 });
    })
  ),
  http.put(
    "/api/studies/:id",
    withAuth(async ({ request, params }) => {
      const { id } = params;
      const body = await request.json();
      const studies = getDatabaseTable("studies").exec();
      const studyIndex = studies.findIndex((study) => study.id === id);
      if (studyIndex === -1) {
        return HttpResponse.json(
          { error: "Estudio no encontrado." },
          { status: 404 }
        );
      }
      const updatedStudy = {
        ...studies[studyIndex],
        ...body,
      };
      studies[studyIndex] = updatedStudy;
      setItem(VITE_DB_KEY, "studies", studies);
      await delay(1000);
      return HttpResponse.json(updatedStudy);
    })
  ),
  http.delete(
    "/api/studies/:id",
    withAuth(async ({ params }) => {
      const { id } = params;
      const studies = getDatabaseTable("studies").exec();
      const studyIndex = studies.findIndex((study) => study.id === id);
      if (studyIndex === -1) {
        return HttpResponse.json(
          { error: "Estudio no encontrado." },
          { status: 404 }
        );
      }
      studies.splice(studyIndex, 1);
      setItem(VITE_DB_KEY, "studies", studies);
      await delay(1000);
      return HttpResponse.json({ message: "Estudio eliminado." });
    })
  ),
];

export default studiesHandlers;
