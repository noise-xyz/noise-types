export type Position = {
    id: string;
    userId: string;
    assetId: string;
    runningPositionSize: number; // Signed value (negative for shorts)
    runningCollateral: number;
    totalFeesSettled: number;
    averageEntryPrice: number;
    liquidationPrice: number;
    settledProfitOrLossValue: number;
    settledProfitOrLossPercent: number;
    nClosedTrades: number;
};
