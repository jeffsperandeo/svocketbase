FROM alpine:latest
ARG PB_VERSION=0.22.23
RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip \
    && chmod +x /pocketbase
WORKDIR /pb
COPY pb_migrations /pb/pb_migrations
EXPOSE 3040
CMD ["/pocketbase", "serve", "--http=0.0.0.0:3040"]