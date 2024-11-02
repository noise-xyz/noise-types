import { activityEventsTable } from "@/database/tables";
import type { ActivityEvent, EventType } from "@/events";
import { TradeSide } from "@/trading";
import { fromPostgresNumeric } from "@/utils/numbers";

/**
 * Converts a database activity event record to an ActivityEvent object
 */
export function activityEventFromDatabase(
    dbEvent: typeof activityEventsTable.$inferSelect,
): ActivityEvent {
    return {
        id: dbEvent.id,
        assetId: dbEvent.assetId as string,
        traderSafeAddress: dbEvent.traderSafeAddress as string,
        timestampUnix: dbEvent.timestampUnix as number,
        eventType: dbEvent.eventType as EventType,
        side: dbEvent.side as TradeSide,
        priceAtTime: fromPostgresNumeric(dbEvent.priceAtTime),
        positionSize: fromPostgresNumeric(dbEvent.positionSize),
    };
}
