install:
	go mod download
	go mod tidy

podman:
	podman-compose --file compose.yaml build && podman-compose --file compose.yaml up --remove-orphans

podman_down:
	podman-compose --file compose.yaml down -v

migrate:
	atlas migrate apply --dir "file://migrations" --url "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"