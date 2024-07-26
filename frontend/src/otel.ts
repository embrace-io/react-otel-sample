import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import {
  SimpleSpanProcessor,
  WebTracerProvider,
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
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http/build/src/platform/browser";

const setupOTelSDK = () => {
  const resource = Resource.default().merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: "react-client",
    }),
  );

  const tracerProvider = new WebTracerProvider({
    resource: resource,
  });

  const traceExporter = new OTLPTraceExporter({
    url: "http://localhost:7070/v1/traces",
    headers: {},
  });

  const spanProcessor = new SimpleSpanProcessor(traceExporter);

  const metricExporter = new OTLPMetricExporter({
    url: "http://localhost:7070/v1/metrics",
    headers: {},
  });
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
    exportIntervalMillis: 10000,
  });

  const meterProvider = new MeterProvider({
    resource: resource,
    readers: [metricReader],
  });

  metrics.setGlobalMeterProvider(meterProvider);

  tracerProvider.addSpanProcessor(spanProcessor);
  tracerProvider.register();
  trace.setGlobalTracerProvider(tracerProvider);

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
};

export { setupOTelSDK };

1721913883463000000;
