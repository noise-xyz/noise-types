import { EventType } from "./";
import { TradeSide } from "../trading";

export type ActivityEvent = {
    id: string;
    assetId: string;
    traderSafeAddress: string;
    timestampUnix: number;
    eventType: EventType;
    side: TradeSide;
    priceAtTime: number;
    positionSize: number;
};
