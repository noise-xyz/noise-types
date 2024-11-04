import { positionsTable } from "../database/tables";
import type { Position } from "../positions";

/**
 * Converts a Position object to database format
 */
export function positionToDatabase(
    position: Position,
): typeof positionsTable.$inferInsert {
    return {
        id: position.id,
        userId: position.userId,
        assetId: position.assetId,
        runningPositionSizeVector: position.runningPositionSizeVector
            .toFixed(20)
            .toString(),
        runningPositionSizeScalar: position.runningPositionSizeScalar
            .toFixed(20)
            .toString(),
        runningCollateral: position.runningCollateral.toFixed(20).toString(),
        totalFeesSettled: position.totalFeesSettled.toFixed(20).toString(),
        averageEntryPrice: position.averageEntryPrice.toFixed(20).toString(),
        liquidationPrice: position.liquidationPrice.toFixed(20).toString(),
        settledProfitOrLossValue: position.settledProfitOrLossValue
            .toFixed(20)
            .toString(),
        settledProfitOrLossPercent: position.settledProfitOrLossPercent
            .toFixed(20)
            .toString(),
        nClosedTrades: position.nClosedTrades,
    };
}
