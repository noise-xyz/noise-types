export type Position = {
    id: string;
    userId: string;
    assetId: string;
    runningPositionSizeVector: number; // Signed value (negative for shorts)
    runningPositionSizeScalar: number; // Signed value (negative for shorts)
    runningCollateral: number;
    totalFeesSettled: number;
    averageEntryPrice: number;
    liquidationPrice: number;
    settledProfitOrLossValue: number;
    settledProfitOrLossPercent: number;
    nClosedTrades: number;
};
