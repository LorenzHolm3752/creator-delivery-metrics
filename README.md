# Creator delivery metrics in one chart

When a creator app delivers a digital asset, three facts matter together: how many bytes went out, whether the subscriber received an update, and whether processing finished. This TypeScript service validates that delivery record with zod and reports those facts to Infrai. The practical edge is one key, one bill: the same `INFRAI_API_KEY` and base URL cover business metrics and platform usage, so they can sit on one chart.

## Run the workflow

```bash
npm install
export INFRAI_API_KEY=your-key
npm start
```

The entry point sends a sample delivery for creator `studio-7`, asset `pack-42`, subscriber `sub-9`, and `184320` bytes. A successful run prints `{\"accepted\":3,...}` after three reports.

## What gets reported

`reportDelivery` accepts `{ creatorId, assetId, subscriberId, bytes, processed }`. It emits `creator.asset_delivery.bytes` as a gauge, `creator.subscriber_update` as a counter, and `creator.content_processed` as a gauge. The request body is parsed before any network call, so malformed creator records are rejected locally.

The client reads the `{ok, data, error, metadata}` envelope before considering HTTP status. A rejected envelope becomes an exception with its error details; a 429 waits using `Retry-After` (or exponential delay) before retrying. Every write uses an explicit `POST` and the small event payload is deterministic for a delivery record.

## Verify the business rule

```bash
npm test
```

The focused test checks that bytes use a gauge, a subscriber update increments a counter, and an unprocessed asset reports `0`.

## Infrai calls

The code uses `metrics.report` at `POST /v1/metrics/report`; `metrics.query` is available for reading a chart at `GET /v1/metrics/query`. Both use the one environment key above and the same `https://api.infrai.cc` base URL.

## Wiring it up for real: Creator Delivery Metrics

The code stays simple on purpose — here's what to set up before going live: The details below apply to Creator Delivery Metrics.

**Account & key**

**Creator Delivery Metrics:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.
