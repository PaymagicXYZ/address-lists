# Address Lists (alpha)

This repo includes a JSON schema for address lists, and TypeScript utilities for working with address lists. It is inspired by and forked from [Uniswap’s Token Lists](https://tokenlists.org/) and uses some features from the [Chainlist project](https://chainlist.org/).

## What are Address lists?

Address Lists are groups of Ethereum addresses that are shareable across apps, wallets, and networks. For example, address books, lists of bad actors, snapshots of token/NFT holders, Sybil tested users, verified smart contracts, or any other grouping.

Anyone can create, validate, or maintain an address list, as long as they follow the specification.

Specifically an instance of an address list is a [JSON](https://www.json.org/json-en.html) blob that contains a list of address metadata for use in wallets and dapp user interfaces.
Token list JSON must validate against the [JSON schema](https://json-schema.org/) in order to be used.
Addresses on address lists, and address lists themselves, are tagged so that users can easily find them.

## JSON Schema $id

The JSON schema ID is [/src/addresslist.schema.json](https://raw.githubusercontent.com/PaymagicXYZ/address-lists/main/src/addresslist.schema.json)

## Validating address lists

This package does not include code for address list validation. You can easily do this by including a library such as 
[ajv](https://ajv.js.org/) to perform the validation against the JSON schema. The schema is exported from the package
for ease of use.

## Scripts
Get NFT PFPs for RTs - `npm run fetchTwitterNftPfps -- Retweets 1484530460051058692`
Convert CSV to Disperse - `npm run convertCSVToDisperse -- input/aave-grant-2-6-22.csv`

