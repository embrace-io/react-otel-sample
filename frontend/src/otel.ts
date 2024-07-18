import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import {
  WebTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-web";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { trace } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";

const setupOTelSDK = () => {
  const resource = Resource.default().merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: "react-client",
    }),
  );

  const provider = new WebTracerProvider({
    resource: resource,
  });

  const exporter = new ConsoleSpanExporter();
  const collectorExporter = new OTLPTraceExporter({
    url: "http://localhost:4318/v1/traces",
    headers: {},
  });

  const processor = new SimpleSpanProcessor(exporter);
  const collectorProcessor = new SimpleSpanProcessor(collectorExporter);

  provider.addSpanProcessor(processor);
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

  trace.setGlobalTracerProvider(provider);
};

export { setupOTelSDK };
