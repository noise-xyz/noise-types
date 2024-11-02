import { EventType } from "@/events";
import { TradeSide } from "@/trading";
import BigNumber from "bignumber.js";

export type ActivityEvent = {
    id: string;
    assetId: string;
    traderSafeAddress: string;
    timestampUnix: number;
    eventType: EventType;
    side: TradeSide;
    priceAtTime: BigNumber;
    positionSize: BigNumber;
};
