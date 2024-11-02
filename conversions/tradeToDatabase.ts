import { tradesTable } from "@/database/tables";
import type { Trade } from "@/trading";
import { TradeStatus } from "@/trading";
import { toPostgresNumeric } from "@/utils/numbers";

/**
 * Converts a Trade object to database format
 */
export function tradeToDatabase(trade: Trade): typeof tradesTable.$inferInsert {
    const base = {
        id: trade.id,
        positionId: trade.positionId,
        traderSafeAddress: trade.traderSafeAddress,
        assetId: trade.assetId,
        collateral: toPostgresNumeric(trade.collateral),
        leverage: toPostgresNumeric(trade.leverage),
        openPositionSize: toPostgresNumeric(trade.openPositionSize),
        openPrice: toPostgresNumeric(trade.openPrice),
        openTxHash: trade.openTxHash,
        openTimestampUnix: trade.openTimestampUnix,
        openTimestamp: new Date(trade.openTimestampUnix * 1000),
        side: trade.side,
        status: trade.status,
    };

    if (trade.status === TradeStatus.OPEN) {
        return {
            ...base,
            closePositionSize: null,
            closePrice: null,
            closeTxHash: null,
            closeTimestampUnix: null,
            closeTimestamp: null,
            didGain: null,
            settledProfitOrLossValue: null,
            settledProfitOrLossPercent: null,
        };
    }

    return {
        ...base,
        closePositionSize: toPostgresNumeric(trade.closePositionSize),
        closePrice: toPostgresNumeric(trade.closePrice),
        closeTxHash: trade.closeTxHash,
        closeTimestampUnix: trade.closeTimestampUnix,
        closeTimestamp: new Date(trade.closeTimestampUnix * 1000),
        didGain: trade.didGain,
        settledProfitOrLossValue: toPostgresNumeric(
            trade.settledProfitOrLossValue,
        ),
        settledProfitOrLossPercent: toPostgresNumeric(
            trade.settledProfitOrLossPercent,
        ),
    };
}
