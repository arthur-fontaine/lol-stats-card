import { hc } from "hono/client";
import type { AppType } from "./main";

export const createApiClient = (baseUrl: string) => hc<AppType>(baseUrl)
