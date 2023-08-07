#!/bin/bash

port="${1:-8545}"
mnemonic="oyster step broccoli sing resource monster regret pet alien lizard give sort"

ganache -p "${port}" -m "${mnemonic}" --db $(pwd)/debug/
