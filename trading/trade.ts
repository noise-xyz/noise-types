import { TradeSide, TradeStatus } from './';
import BigNumber from "bignumber.js";

export type Trade = {
    id: number;
    positionId: string;
    traderSafeAddress: string;
    assetId: string;
    collateral: BigNumber;
    leverage: BigNumber;
    openPositionSize: BigNumber;
    openPrice: BigNumber;
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
          closePositionSize: BigNumber;
          closePrice: BigNumber;
          closeTxHash: string;
          closeTimestampUnix: number;
          didGain: boolean;
          settledProfitOrLossValue: BigNumber;
          settledProfitOrLossPercent: BigNumber;
      }
);
