import { SpansContext } from "./hooks/useSpansContext";
import { FC, PropsWithChildren, useCallback, useRef } from "react";
import { context, Span, SpanOptions, trace } from "@opentelemetry/api";
import { SpanName } from "./constants/spans";

const SpansProvider: FC<PropsWithChildren> = ({ children }) => {
  const spansRef = useRef<Map<SpanName, Span>>(new Map());

  const getOrCreateSpan = useCallback(
    (name: SpanName, options?: SpanOptions): [Span, boolean] => {
      if (spansRef.current.has(name)) {
        return [spansRef.current.get(name)!, false];
      }

      const tracer = trace.getTracer("react-client");
      const span = tracer.startSpan(name, options);

      spansRef.current.set(name, span);

      return [span, true];
    },
    [],
  );

  const withSpanContext = useCallback(
    (name: SpanName, callback: () => void) => {
      const [span] = getOrCreateSpan(name);
      context.with(trace.setSpan(context.active(), span), callback);
    },
    [getOrCreateSpan],
  );

  const endSpan = useCallback((name: SpanName) => {
    const span = spansRef.current.get(name);

    if (span) {
      span.end();
      spansRef.current.delete(name);
    }
  }, []);

  return (
    <SpansContext.Provider
      value={{ getOrCreateSpan, withSpanContext, endSpan }}
    >
      {children}
    </SpansContext.Provider>
  );
};

export default SpansProvider;
