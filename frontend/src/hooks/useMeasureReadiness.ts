import { useEffect, useRef } from "react";
import { Attributes, trace } from "@opentelemetry/api";

type UseMeasureReadinessArgs = {
  pageName: string;
  areNetworkRequestsDone?: boolean;
};

const useMeasureReadiness = (
  { pageName, areNetworkRequestsDone }: UseMeasureReadinessArgs,
  extraAttributes: Attributes = {},
) => {
  const now = useRef<number>(
    window.coldStart ? performance.timeOrigin : new Date().getTime(),
  );

  useEffect(() => {
    if (window.coldStart) {
      window.coldStart = false;
    }
  }, []);

  useEffect(() => {
    const tracer = trace.getTracer("react-client");

    if (areNetworkRequestsDone === undefined || areNetworkRequestsDone) {
      const span = tracer.startSpan("Page Ready", {
        startTime: now.current,
      });

      span.setAttributes({
        page_name: pageName,
        ...extraAttributes,
      });

      span.end();
    }
  }, [areNetworkRequestsDone]);
};

export default useMeasureReadiness;
