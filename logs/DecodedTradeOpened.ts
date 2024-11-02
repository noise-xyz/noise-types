import { EventType } from "@/events";

export type DecodedTradeOpened = {
    eventType: EventType.OPEN;
    tradeId: number;
    trader: string;
    collateral: number;
    leverage: number;
    positionSize: number;
    openPrice: number;
    isLong: boolean;
    timestamp: number;
    transactionHash: string;
};
