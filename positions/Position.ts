export type Position = {
    id: string;
    userId: string;
    assetId: string;
    runningPositionSizeVector: number; // Signed value (negative for shorts)
    runningPositionSizeScalar: number;
    runningQuantity: number;
    runningCollateral: number;
    totalFeesSettled: number;
    averageEntryPrice: number;
    liquidationPrice: number;
    settledProfitOrLossValue: number;
    settledProfitOrLossPercent: number;
    nOpenedTrades: number;
    nClosedTrades: number;
};
