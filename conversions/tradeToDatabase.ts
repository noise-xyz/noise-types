import { tradesTable } from "../database/tables";
import type { Trade } from "../trading";
import { TradeStatus } from "../trading";

/**
 * Converts a Trade object to database format
 */
export function tradeToDatabase(trade: Trade): typeof tradesTable.$inferInsert {
    const base = {
        id: trade.id,
        positionId: trade.positionId,
        traderSafeAddress: trade.traderSafeAddress,
        assetId: trade.assetId,
        collateral: trade.collateral.toFixed(20).toString(),
        leverage: trade.leverage.toFixed(20).toString(),
        openPositionSize: trade.openPositionSize.toFixed(20).toString(),
        openPrice: trade.openPrice.toFixed(20).toString(),
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
        closePositionSize: trade.closePositionSize.toFixed(20).toString(),
        closePrice: trade.closePrice.toFixed(20).toString(),
        closeTxHash: trade.closeTxHash,
        closeTimestampUnix: trade.closeTimestampUnix,
        closeTimestamp: new Date(trade.closeTimestampUnix * 1000),
        didGain: trade.didGain,
        settledProfitOrLossValue: trade.settledProfitOrLossValue
            .toFixed(20)
            .toString(),
        settledProfitOrLossPercent: trade.settledProfitOrLossPercent
            .toFixed(20)
            .toString(),
    };
}
