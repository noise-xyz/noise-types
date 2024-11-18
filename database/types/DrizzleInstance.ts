import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { DrizzleSchema } from "./";

export type DrizzleInstance = PostgresJsDatabase<DrizzleSchema>;
