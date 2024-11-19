import { EventType } from "../events";

export type DecodedTradeClosed = {
    eventType: EventType.CLOSE | EventType.LIQUIDATION;
    tradeId: number;
    trader: string;
    closePositionSize: number;
    closePrice: number;
    didGain: boolean;
    pnl: number;
    timestamp: number;
    transactionHash: string;
};
