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
	docker build . -t $(IMAGE_DEV)

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
      -e NUXT_PUBLIC_BASE_URL=$(NUXT_PUBLIC_BASE_URL) \
      -e NUXT_PUBLIC_WEB_APP_URL=$(NUXT_PUBLIC_WEB_APP_URL) \
      -e NUXT_PUBLIC_GATEWAY_URL=$(NUXT_PUBLIC_GATEWAY_URL) \
      -e NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=$(NUXT_PUBLIC_GOOGLE_ANALYTICS_ID) \
      -e NUXT_PUBLIC_GOOGLE_CLIENT_ID=$(NUXT_PUBLIC_GOOGLE_CLIENT_ID) \
      -e NUXT_PUBLIC_CAPTCHA_CLIENT_KEY=$(NUXT_PUBLIC_CAPTCHA_CLIENT_KEY) \
      -d \
      $(IMAGE_DEV)

stop:
	docker stop $(CONTAINER_NAME)
