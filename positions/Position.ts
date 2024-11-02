import BigNumber from "bignumber.js";

export type Position = {
    id: string;
    userId: string;
    assetId: string;
    runningPositionSizeVector: BigNumber; // Signed value (negative for shorts)
    runningPositionSizeScalar: BigNumber;
    runningQuantity: BigNumber;
    runningCollateral: BigNumber;
    totalFeesSettled: BigNumber;
    averageEntryPrice: BigNumber;
    liquidationPrice: BigNumber;
    settledProfitOrLossValue: BigNumber;
    settledProfitOrLossPercent: BigNumber;
    nClosedTrades: number;
};
