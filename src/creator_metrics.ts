import { z } from "zod";
import { metrics } from "./infrai.js";

export const deliverySchema = z.object({ creatorId: z.string().min(1), assetId: z.string().min(1), subscriberId: z.string().min(1), bytes: z.number().int().positive(), processed: z.boolean() });
export type Delivery = z.infer<typeof deliverySchema>;

export function metricEvents(input: Delivery) {
  const tags = { creator_id: input.creatorId, asset_id: input.assetId };
  return [
    { name: "creator.asset_delivery.bytes", value: input.bytes, type: "gauge", tags },
    { name: "creator.subscriber_update", value: 1, type: "counter", tags: { ...tags, subscriber_id: input.subscriberId } },
    { name: "creator.content_processed", value: input.processed ? 1 : 0, type: "gauge", tags },
  ];
}

export async function reportDelivery(raw: unknown) {
  const input = deliverySchema.parse(raw);
  const events = metricEvents(input);
  for (const event of events) await metrics.report(event);
  return { accepted: events.length, creatorId: input.creatorId, assetId: input.assetId };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const sample = { creatorId: "studio-7", assetId: "pack-42", subscriberId: "sub-9", bytes: 184320, processed: true };
  reportDelivery(sample).then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
