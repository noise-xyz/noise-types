import { activityEventsTable } from "@/database/tables";
import type { ActivityEvent } from "@/events";
import { toPostgresNumeric } from "@/utils/numbers";
/**
 * Converts an ActivityEvent object to database format
 */
export function activityEventToDatabase(
    event: ActivityEvent,
): typeof activityEventsTable.$inferInsert {
    return {
        id: event.id,
        assetId: event.assetId,
        traderSafeAddress: event.traderSafeAddress,
        timestampUnix: event.timestampUnix,
        timestamp: new Date(event.timestampUnix * 1000),
        eventType: event.eventType,
        side: event.side,
        priceAtTime: toPostgresNumeric(event.priceAtTime),
        positionSize: toPostgresNumeric(event.positionSize),
    };
}
