const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

register.registerMetric(httpRequestDuration);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.use(async (req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    });
  });

  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "P95/P99 Latency Production Demo",
    endpoints: ["/fast", "/slow", "/random-latency", "/metrics"]
  });
});

app.get("/fast", async (req, res) => {
  await sleep(50);
  res.json({
    endpoint: "/fast",
    latency: "around 50ms",
    message: "This represents normal API behavior"
  });
});

app.get("/slow", async (req, res) => {
  await sleep(2000);
  res.json({
    endpoint: "/slow",
    latency: "around 2000ms",
    message: "This represents a slow production dependency"
  });
});

app.get("/random-latency", async (req, res) => {
  const random = Math.random();

  let delay = 100;

  if (random > 0.95) {
    delay = 3000;
  } else if (random > 0.90) {
    delay = 1000;
  }

  await sleep(delay);

  res.json({
    endpoint: "/random-latency",
    simulatedDelayMs: delay,
    explanation: "Most requests are fast, but a few slow requests increase P95/P99 latency"
  });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Latency demo API running on port ${PORT}`);
});
