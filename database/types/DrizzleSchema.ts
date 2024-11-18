import {
    usersTable,
    tradesTable,
    pricesTable,
    positionsTable,
    assetsTable,
    activityEventsTable,
    refreshTokensTable,
} from "../tables";
import {
    usersRelations,
    tradesRelations,
    pricesRelations,
    positionsRelations,
    assetsRelations,
    activityEventsRelations,
} from "../relations";

export type DrizzleSchema = {
    usersTable: typeof usersTable;
    usersRelations: typeof usersRelations;
    tradesTable: typeof tradesTable;
    tradesRelations: typeof tradesRelations;
    pricesTable: typeof pricesTable;
    pricesRelations: typeof pricesRelations;
    positionsTable: typeof positionsTable;
    positionsRelations: typeof positionsRelations;
    assetsTable: typeof assetsTable;
    assetsRelations: typeof assetsRelations;
    activityEventsTable: typeof activityEventsTable;
    activityEventsRelations: typeof activityEventsRelations;
    refreshTokensTable: typeof refreshTokensTable;
};
