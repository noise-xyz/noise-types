import { positionsTable } from '../database/tables';
import type { Position } from '../positions';
import { toPostgresNumeric } from '../utils/numbers';

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
        runningPositionSizeVector: toPostgresNumeric(
            position.runningPositionSizeVector,
        ),
        runningPositionSizeScalar: toPostgresNumeric(
            position.runningPositionSizeScalar,
        ),
        runningQuantity: toPostgresNumeric(position.runningQuantity),
        runningCollateral: toPostgresNumeric(position.runningCollateral),
        totalFeesSettled: toPostgresNumeric(position.totalFeesSettled),
        averageEntryPrice: toPostgresNumeric(position.averageEntryPrice),
        liquidationPrice: toPostgresNumeric(position.liquidationPrice),
        settledProfitOrLossValue: toPostgresNumeric(
            position.settledProfitOrLossValue,
        ),
        settledProfitOrLossPercent: toPostgresNumeric(
            position.settledProfitOrLossPercent,
        ),
        nClosedTrades: position.nClosedTrades,
    };
}
