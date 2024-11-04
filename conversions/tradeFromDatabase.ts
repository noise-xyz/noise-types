import { tradesTable } from "../database/tables";
import type { Trade } from "../trading";
import { TradeSide, TradeStatus } from "../trading";
/**
 * Converts a database trade record to a Trade object
 */
export function tradeFromDatabase(
    dbTrade: typeof tradesTable.$inferSelect,
): Trade {
    const base = {
        id: dbTrade.id,
        positionId: dbTrade.positionId as string,
        traderSafeAddress: dbTrade.traderSafeAddress as string,
        assetId: dbTrade.assetId as string,
        collateral: parseFloat(dbTrade.collateral as string),
        leverage: parseFloat(dbTrade.leverage as string),
        openPositionSize: parseFloat(dbTrade.openPositionSize as string),
        openPrice: parseFloat(dbTrade.openPrice as string),
        openTxHash: dbTrade.openTxHash as string,
        openTimestampUnix: dbTrade.openTimestampUnix as number,
        side: dbTrade.side as TradeSide,
        status: dbTrade.status as TradeStatus,
    };

    if (dbTrade.status === TradeStatus.OPEN) {
        return {
            ...base,
            status: TradeStatus.OPEN,
            closePositionSize: null,
            closePrice: null,
            closeTxHash: null,
            closeTimestampUnix: null,
            didGain: null,
            settledProfitOrLossValue: null,
            settledProfitOrLossPercent: null,
        };
    }

    return {
        ...base,
        status: dbTrade.status as TradeStatus.CLOSED | TradeStatus.LIQUIDATED,
        closePositionSize: parseFloat(dbTrade.closePositionSize as string),
        closePrice: parseFloat(dbTrade.closePrice as string),
        closeTxHash: dbTrade.closeTxHash!,
        closeTimestampUnix: dbTrade.closeTimestampUnix!,
        didGain: dbTrade.didGain!,
        settledProfitOrLossValue: parseFloat(
            dbTrade.settledProfitOrLossValue as string,
        ),
        settledProfitOrLossPercent: parseFloat(
            dbTrade.settledProfitOrLossPercent as string,
        ),
    };
}
