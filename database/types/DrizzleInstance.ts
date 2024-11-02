import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { DrizzleSchema } from "@/database/types";

export type DrizzleInstance = PostgresJsDatabase<DrizzleSchema>;
