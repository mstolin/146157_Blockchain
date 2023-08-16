#!/bin/bash

port="${1:-8545}"
mnemonic="veteran sleep helmet more lawn mixed put hill save enough cook hammer"

ganache -p "${port}" -m "${mnemonic}" --db $(pwd)/debug/
