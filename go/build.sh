#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")"

export GOOS=js
export GOARCH=wasm

go build -o ../src/jieba.wasm jieba.go
