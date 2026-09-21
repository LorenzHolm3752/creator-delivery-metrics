import assert from "node:assert/strict";
import { metricEvents } from "../src/creator_metrics.js";

const events = metricEvents({ creatorId: "c1", assetId: "a1", subscriberId: "s1", bytes: 512, processed: false });
assert.equal(events[0].type, "gauge");
assert.equal(events[0].value, 512);
assert.equal(events[1].type, "counter");
assert.equal(events[2].value, 0);
console.log("creator metric decision test passed");
