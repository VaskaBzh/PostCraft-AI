SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

# --- Variables ---
PROJECT  ?= $(shell node -p "require('./package.json').name" 2>/dev/null || basename $(CURDIR))
VERSION  ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT   ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")

NPM ?= npm

# --- Help ---

.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help message
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} \
		/^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)}' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## Install dependencies
	$(NPM) install

.PHONY: dev
dev: install ## Start development server (http://localhost:5173)
	$(NPM) run dev

.PHONY: build
build: install ## Build for production (dist/)
	$(NPM) run build

.PHONY: preview
preview: build ## Preview production build locally
	$(NPM) run preview

##@ Code Quality

.PHONY: lint
lint: ## Run ESLint
	$(NPM) run lint

.PHONY: lint-fix
lint-fix: ## Run ESLint with auto-fix
	$(NPM) run lint -- --fix

.PHONY: typecheck
typecheck: ## Run TypeScript type checking
	npx tsc --noEmit

##@ CI

.PHONY: ci
ci: install lint typecheck build ## Run full CI pipeline (lint + typecheck + build)

##@ Maintenance

.PHONY: clean
clean: ## Remove build artifacts and caches
	rm -rf dist/ node_modules/.cache

.PHONY: clean-all
clean-all: clean ## Remove everything including node_modules
	rm -rf node_modules/
