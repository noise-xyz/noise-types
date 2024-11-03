import { tradesTable } from '../database/tables';
import type { Trade } from '../trading';
import { TradeSide, TradeStatus } from '../trading';
import { fromPostgresNumeric } from '../utils/numbers';

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
        collateral: fromPostgresNumeric(dbTrade.collateral),
        leverage: fromPostgresNumeric(dbTrade.leverage),
        openPositionSize: fromPostgresNumeric(dbTrade.openPositionSize),
        openPrice: fromPostgresNumeric(dbTrade.openPrice),
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
        closePositionSize: fromPostgresNumeric(dbTrade.closePositionSize),
        closePrice: fromPostgresNumeric(dbTrade.closePrice),
        closeTxHash: dbTrade.closeTxHash!,
        closeTimestampUnix: dbTrade.closeTimestampUnix!,
        didGain: dbTrade.didGain!,
        settledProfitOrLossValue: fromPostgresNumeric(
            dbTrade.settledProfitOrLossValue,
        ),
        settledProfitOrLossPercent: fromPostgresNumeric(
            dbTrade.settledProfitOrLossPercent,
        ),
    };
}
