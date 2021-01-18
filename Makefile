include .env
export

# Local config
CONTAINER_NAME=cashtrack_website
CONTAINER_PORT=3000

# Deploy config
REPO=cashtrack/website
IMAGE_RELEASE=$(REPO):$(RELEASE_VERSION)
IMAGE_DEV=$(REPO):dev
IMAGE_LATEST=$(REPO):latest

.PHONY: build tag push start stop

build:
	docker build . -t $(IMAGE_DEV) --no-cache

tag:
	docker tag $(IMAGE_DEV) $(IMAGE_RELEASE)
	docker tag $(IMAGE_DEV) $(IMAGE_LATEST)

push:
	docker push $(IMAGE_RELEASE)
	docker push $(IMAGE_LATEST)

start:
	docker run \
	  --rm \
      --name $(CONTAINER_NAME) \
      -p $(CONTAINER_PORT):3000 \
      -e BASE_URL=$(BASE_URL) \
      -e API_URL=$(API_URL) \
      -e WEB_APP_URL=$(WEB_APP_URL) \
      -d \
      $(IMAGE_DEV)

stop:
	docker stop $(CONTAINER_NAME)
