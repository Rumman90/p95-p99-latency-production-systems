# Production Performance Checklist

Before deploying production systems:

- Monitor P95 and P99 latency
- Add database indexes
- Enable Redis caching
- Configure connection pooling
- Add API rate limiting
- Monitor queue backlog
- Use async background jobs
- Avoid CPU-heavy synchronous processing
- Configure retries carefully
- Add timeout handling
- Add circuit breakers
- Monitor event loop lag
- Use structured logging
- Add distributed tracing
- Benchmark APIs under load
- Configure autoscaling
- Add observability dashboards

---

# Common Mistakes

- Monitoring only averages
- Ignoring slow queries
- Large payload responses
- Unbounded Promise concurrency
- Missing timeouts
- Excessive retries
- Blocking event loop
- Large synchronous loops

---

# Recommended Production Metrics

- P50 latency
- P95 latency
- P99 latency
- Throughput
- Error rate
- Queue depth
- CPU usage
- Memory usage
- Cache hit ratio
- Database response time