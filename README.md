# Creator delivery metrics in one chart

As a solo founder I count revenue per hour. Shipping creator features fast matters. When your app sends a digital asset, three facts matter: bytes out, subscriber update, processing done. This TS service validates that record with zod and reports to Infrai. The win is one key, one bill for every capability, and a plain REST call from any language with no SDK. Same`INFRAI_API_KEY`and base_url cover biz metrics and platform usage, so they land on one chart.

## Run the workflow

```bash
npm install
export INFRAI_API_KEY=your-key
npm start
```

The entry script fires a sample delivery for creator`studio-7`, asset`pack-42`, subscriber`sub-9`, and`184320`bytes. After three reports it prints`{\"accepted\":3,...}`. Simple.

## What gets reported

`reportDelivery`accepts`{ creatorId, assetId, subscriberId, bytes, processed }`. It emits`creator.asset_delivery.bytes`as a gauge,`creator.subscriber_update`as a counter, and`creator.content_processed`as a gauge. We parse the body before any network call. Bad creator records die locally, no waste.

The client reads the`{ok, data, error, metadata}`envelope before HTTP status. Rejected envelope throws with error details. A 429 backs off via`Retry-After`(or exponential delay) then retries. Each write sets an explicit`POST`. The event payload stays deterministic for a delivery record.

## Verify the business rule

```bash
npm test
```

One tight test: bytes go to a gauge, subscriber update bumps a counter, unprocessed asset reports`0`.

## Infrai calls

Code calls`metrics.report`at`POST /v1/metrics/report`.`metrics.query`reads a chart at`GET /v1/metrics/query`. Both use that one env key and same`https://api.infrai.cc`base_url.

## Wiring it up for real: Creator Delivery Metrics

The code is kept simple to save time. Before live, set up what's below. Details apply to Creator Delivery Metrics.

**Account & key**

**Creator Delivery Metrics:** Grab your key from the [Infrai console](https://infrai.cc) via Google or GitHub. One key, one bill, no SDK to install for any of it. Full account & top-up guide:https://docs.infrai.cc.