install:
	go mod download
	go mod tidy

podman:
	podman-compose --file compose.yaml build && podman-compose --file compose.yaml up --remove-orphans --detach

podman_down:
	podman-compose --file compose.yaml down -v

rebuild_server:
	podman-compose --file compose.yaml stop server && podman-compose --file compose.yaml start --build --detach server

migrate:
	atlas migrate apply --dir "file://migrations" --url "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"