import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import {
  WebTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-web";
import { metrics, trace } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

const setupOTelSDK = () => {
  const resource = Resource.default().merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: "react-client",
    }),
  );

  const provider = new WebTracerProvider({
    resource: resource,
  });

  const collectorExporter = new OTLPTraceExporter({
    url: "http://localhost:7070/v1/traces",
    headers: {},
  });

  const collectorProcessor = new SimpleSpanProcessor(collectorExporter);

  const metricsCollectorExporter = new OTLPMetricExporter({
    url: "http://localhost:7070/v1/metrics",
    headers: {},
  });
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricsCollectorExporter,
    // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
    exportIntervalMillis: 10000,
  });

  const myServiceMeterProvider = new MeterProvider({
    resource: resource,
    readers: [metricReader],
  });

  provider.addSpanProcessor(collectorProcessor);
  provider.register();

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [
          new RegExp(/http:\/\/localhost:8080\/.*/),
        ],
      }),
      new DocumentLoadInstrumentation(),
    ],
  });

  metrics.setGlobalMeterProvider(myServiceMeterProvider);
  trace.setGlobalTracerProvider(provider);
};

export { setupOTelSDK };
