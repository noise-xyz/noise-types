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
        runningPositionSize: position.runningPositionSize.toString(),
        runningCollateral: position.runningCollateral.toString(),
        totalFeesSettled: position.totalFeesSettled.toString(),
        averageEntryPrice: position.averageEntryPrice.toString(),
        liquidationPrice: position.liquidationPrice.toString(),
        settledProfitOrLossValue: position.settledProfitOrLossValue.toString(),
        settledProfitOrLossPercent:
            position.settledProfitOrLossPercent.toString(),
        nClosedTrades: position.nClosedTrades,
    };
}
