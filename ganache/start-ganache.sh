#!/bin/bash

port="${1:-8545}"
mnemonic="craft party conduct panther grocery sock blade defense indoor fox butter slogan"

ganache -p "${port}" -m "${mnemonic}" --db $(pwd)/debug/
