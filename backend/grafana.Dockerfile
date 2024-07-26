FROM grafana/otel-lgtm

COPY tempo-config.yaml .

CMD /otel-lgtm/run-all.sh