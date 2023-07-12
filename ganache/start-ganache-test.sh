#!/bin/bash

port="${1:-8545}"
mnemonic="deny vault maximum sort call drama barrel tongue upon equal tennis equip"

ganache -p "${port}" -m "${mnemonic}" --db /workspaces/146157_Blockchain/ganache/test/
