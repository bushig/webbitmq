.PHONY: help
help: ## Show help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) |  awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development environment commands
.PHONY: up
up: ## Start development environment with hot reload
	@docker-compose -f docker-compose.dev.yml up

.PHONY: down
down: ## Stop and remove development containers
	@docker-compose -f docker-compose.dev.yml down

# Testing and linting
.PHONY: lint
lint: ## Run backend lints
	@pre-commit run --all-files

.PHONY: test
test: up ## Run tests in development environment
	@docker exec -it webbitmq-backend-1 pytest -s ./tests

# Build commands
.PHONY: build-prod
build-prod: ## Build production Docker image
	@docker build -t webbitmq:latest -f build.Dockerfile .

.PHONY: lock
lock: ## Update poetry.lock file
	@docker exec -it frachter_api_1 poetry lock --no-update
