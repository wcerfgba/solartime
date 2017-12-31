#!/bin/sh

function run-js {
  babel-node $1 --presets env
}