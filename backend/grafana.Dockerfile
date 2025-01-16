FROM grafana/otel-lgtm@v0.8.2

COPY tempo-config.yaml .

CMD /otel-lgtm/run-all.sh