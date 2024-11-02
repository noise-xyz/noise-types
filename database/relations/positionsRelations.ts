import { relations } from "drizzle-orm";
import { positionsTable, usersTable, tradesTable } from "@/database/tables";

export const positionsRelations = relations(
    positionsTable,
    ({ one, many }) => ({
        user: one(usersTable, {
            fields: [positionsTable.userId],
            references: [usersTable.id],
        }),
        trades: many(tradesTable),
    }),
);
