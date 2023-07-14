#!/bin/bash

port="${1:-8545}"
mnemonic="view spoon hybrid small bridge quit any token either tuition net witness"

ganache -p "${port}" -m "${mnemonic}" --db $(pwd)/debug/
