import { Attributes, metrics } from "@opentelemetry/api";
import { useEffect } from "react";

const useTrackPageView = (
  pageName: string,
  extraAttributes: Attributes = {},
) => {
  useEffect(() => {
    const meter = metrics.getMeter("react-client");

    const counter = meter.createCounter("react_client_page_view", {
      description: "Number of views for a page",
    });

    counter.add(1, {
      "react_client.page_name": pageName,
      ...extraAttributes,
    });
    // Make sure this only runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useTrackPageView;
