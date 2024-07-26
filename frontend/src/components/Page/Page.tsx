import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { Attributes } from "@opentelemetry/api";
import useTrackPageView from "../../hooks/useTrackPageView";
import useSpansContext from "../SpansProvider/hooks/useSpansContext";

type PageProps = {
  isLoading?: boolean;
  instrumentation: {
    pageName: string;
    attributes?: Attributes;
  };
};

const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  instrumentation,
  isLoading,
}) => {
  const wasColdStart = useRef(window.coldStart);

  const { pageName, attributes } = instrumentation;
  const { endSpan, getOrCreateSpan } = useSpansContext();

  getOrCreateSpan("Page Ready", {
    startTime: wasColdStart.current
      ? performance.timeOrigin
      : new Date().getTime(),
    attributes: {
      "react_client.cold_start": wasColdStart.current,
      "react_client.page_name": pageName,
      ...attributes,
    },
  });

  useEffect(() => {
    if (window.coldStart) {
      window.coldStart = false;
    }
  }, []);

  useEffect(() => {
    if (isLoading === undefined || !isLoading) {
      endSpan("Page Ready");
    }
  }, [endSpan, isLoading]);

  useTrackPageView(pageName, attributes);

  if (isLoading) {
    return "Loading";
  }

  return <>{children}</>;
};

export default Page;
