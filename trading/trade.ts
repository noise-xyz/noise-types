import { TradeSide, TradeStatus } from "./";

export type Trade = {
    id: number;
    positionId: string;
    traderSafeAddress: string;
    assetId: string;
    collateral: number;
    leverage: number;
    openPositionSize: number;
    openPrice: number;
    openTxHash: string;
    openTimestampUnix: number;
    side: TradeSide;
    status: TradeStatus;
} & (
    | {
          status: TradeStatus.OPEN;
          closePositionSize: null;
          closePrice: null;
          closeTxHash: null;
          closeTimestampUnix: null;
          didGain: null;
          settledProfitOrLossValue: null;
          settledProfitOrLossPercent: null;
      }
    | {
          status: TradeStatus.CLOSED | TradeStatus.LIQUIDATED;
          closePositionSize: number;
          closePrice: number;
          closeTxHash: string;
          closeTimestampUnix: number;
          didGain: boolean;
          settledProfitOrLossValue: number;
          settledProfitOrLossPercent: number;
      }
);
