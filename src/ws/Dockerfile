FROM golang:1.23.12-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o ws .

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/ws .
EXPOSE 8080
CMD ["./ws"]
