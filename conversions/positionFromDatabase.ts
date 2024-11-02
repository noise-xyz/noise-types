import { positionsTable } from "@/database/tables";
import type { Position } from "@/positions";
import { fromPostgresNumeric } from "@/utils/numbers";
/**
 * Converts a database position record to a Position object
 */
export function positionFromDatabase(
    dbPosition: typeof positionsTable.$inferSelect,
): Position {
    return {
        id: dbPosition.id,
        userId: dbPosition.userId as string,
        assetId: dbPosition.assetId as string,
        runningPositionSizeVector: fromPostgresNumeric(
            dbPosition.runningPositionSizeVector,
        ),
        runningPositionSizeScalar: fromPostgresNumeric(
            dbPosition.runningPositionSizeScalar,
        ),
        runningQuantity: fromPostgresNumeric(dbPosition.runningQuantity),
        runningCollateral: fromPostgresNumeric(dbPosition.runningCollateral),
        totalFeesSettled: fromPostgresNumeric(dbPosition.totalFeesSettled),
        averageEntryPrice: fromPostgresNumeric(dbPosition.averageEntryPrice),
        liquidationPrice: fromPostgresNumeric(dbPosition.liquidationPrice),
        settledProfitOrLossValue: fromPostgresNumeric(
            dbPosition.settledProfitOrLossValue,
        ),
        settledProfitOrLossPercent: fromPostgresNumeric(
            dbPosition.settledProfitOrLossPercent,
        ),
        nClosedTrades: dbPosition.nClosedTrades as number,
    };
}
