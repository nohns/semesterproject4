# Build Stage
FROM golang:1.22.3-alpine AS build

WORKDIR /app

COPY . .
RUN go mod download
RUN go build -o /bin/app cmd/main.go

# Deploy Stage
FROM alpine:latest

WORKDIR /
COPY --from=build /bin/app /

ENTRYPOINT ["/app"]
