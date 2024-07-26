import { createContext, useContext } from "react";
import { Span, SpanOptions } from "@opentelemetry/api";
import { SpanName } from "../constants/spans";

type SpansContextValue = {
  getOrCreateSpan: (name: SpanName, options?: SpanOptions) => [Span, boolean];
  withSpanContext: (name: SpanName, callback: () => void) => void;
  endSpan: (name: SpanName) => void;
};

const SpansContext = createContext<SpansContextValue>({
  getOrCreateSpan: () => {
    throw new Error("ActiveSpanContextValue not provided");
  },
  withSpanContext: () => {
    throw new Error("ActiveSpanContextValue not provided");
  },
  endSpan: () => {
    throw new Error("ActiveSpanContextValue not provided");
  },
});

const useSpansContext = () => {
  return useContext(SpansContext);
};

export default useSpansContext;
export { SpansContext };
