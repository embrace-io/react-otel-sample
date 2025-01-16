import {Resource} from '@opentelemetry/resources';
import {SEMRESATTRS_SERVICE_NAME} from '@opentelemetry/semantic-conventions';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-web';
import {metrics} from '@opentelemetry/api';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import {OTLPMetricExporter} from '@opentelemetry/exporter-metrics-otlp-http/build/src/platform/browser';
import {sdk} from '@embraceio/embrace-web-sdk';
import {
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';

const SAMPLE_APP_ID = 'efg2m';

const setupOTelSDK = () => {
  const resource = Resource.default().merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'react-client',
    }),
  );

  const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:7070/v1/traces',
    headers: {},
  });

  const spanProcessor = new SimpleSpanProcessor(traceExporter);

  const metricExporter = new OTLPMetricExporter({
    url: 'http://localhost:7070/v1/metrics',
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

  sdk.initSDK({
    resource: resource,
    appID: SAMPLE_APP_ID,
    spanProcessors: [
      new SimpleSpanProcessor(new ConsoleSpanExporter()),
      spanProcessor,
    ],
    logProcessors: [
      new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
    ],
  });
};

export {setupOTelSDK};
