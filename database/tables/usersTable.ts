import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    numeric,
    boolean,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username").unique(),
    profilePicColor: varchar("profilePicColor"),
    verifiedAccessAddress: varchar("verifiedAccessAddress", { length: 42 }),
    safeAddress: varchar("safeAddress", { length: 42 }).unique(),
    accessCode: varchar("accessCode"),
    balance: numeric("balance", { precision: 38, scale: 20 }),
    netIsProfit: boolean("netIsProfit"),
    netSettledProfitOrLossValue: numeric("netSettledProfitOrLossValue", {
        precision: 38,
        scale: 20,
    }),
    email: varchar("email"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
