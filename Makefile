.PHONY: help
help: ## Show help
		@egrep -h '\s##\s' $(MAKEFILE_LIST) |  awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: up
up: ## Start dev environment
		@docker-compose up -d

.PHONY: stop
stop: ## Stop dev environment
		@docker-compose stop

.PHONY: down
down: ## stop and remove docker containers
		@docker-compose down

.PHONY: lint_back
lint: ## run backend lints
		@pre-commit run --all-files

.PHONY: test
test: up ## run tests
		@docker exec -it webbitmq-backend-1 pytest -s ./tests

.PHONY: lock
lock: ## Обновить poetry.lock файл
		@docker exec -it frachter_api_1 poetry lock --no-update
