import { positionsTable } from "../database/tables";
import type { Position } from "../positions";
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
        runningPositionSizeVector: parseFloat(
            dbPosition.runningPositionSizeVector as string,
        ),
        runningPositionSizeScalar: parseFloat(
            dbPosition.runningPositionSizeScalar as string,
        ),
        runningQuantity: parseFloat(dbPosition.runningQuantity as string),
        runningCollateral: parseFloat(dbPosition.runningCollateral as string),
        totalFeesSettled: parseFloat(dbPosition.totalFeesSettled as string),
        averageEntryPrice: parseFloat(dbPosition.averageEntryPrice as string),
        liquidationPrice: parseFloat(dbPosition.liquidationPrice as string),
        settledProfitOrLossValue: parseFloat(
            dbPosition.settledProfitOrLossValue as string,
        ),
        settledProfitOrLossPercent: parseFloat(
            dbPosition.settledProfitOrLossPercent as string,
        ),
        nOpenedTrades: dbPosition.nOpenedTrades as number,
        nClosedTrades: dbPosition.nClosedTrades as number,
    };
}
