# address-lists (beta)

[![Tests](https://github.com/Uniswap/token-lists/workflows/Tests/badge.svg)](https://github.com/Uniswap/token-lists/actions?query=workflow%3ATests)
[![npm](https://img.shields.io/npm/v/@uniswap/token-lists)](https://unpkg.com/@uniswap/token-lists@latest/)

This package includes a JSON schema for address lists, and TypeScript utilities for working with address lists. It is inspired by and forked from [Uniswap’s Token Lists](https://tokenlists.org/) and uses some features from the [Chainlist project](https://chainlist.org/).

## What are address lists?

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

## In Progress


```typescript
import Ajv from 'ajv';
import { schema } from '@uniswap/token-lists'

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const response = await fetch('https://bridge.arbitrum.io/token-list-42161.json')
const listData = await response.json()

const valid = validate(listData)
if (!valid) {
  // oh no!
}
```

## Authoring token lists

### Manual

The best way to manually author token lists is to use an editor that supports JSON schema validation. Most popular
code editors do, such as [IntelliJ](https://www.jetbrains.com/help/idea/json.html#ws_json_schema_add_custom) or 
[VSCode](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings). Other editors
can be found [here](https://json-schema.org/implementations.html#editors).

The schema is registered in the [SchemaStore](https://github.com/SchemaStore/schemastore), and any file that matches
the pattern `*.tokenlist.json` should 
[automatically utilize](https://www.jetbrains.com/help/idea/json.html#ws_json_using_schemas) 
the JSON schema for the [supported text editors](https://www.schemastore.org/json/#editors).

In order for your token list to be able to be used, it must pass all JSON schema validation.

### Automated

If you want to automate token listing, e.g. by pulling from a smart contract, or other sources, you can use this
npm package to take advantage of the JSON schema for validation and the TypeScript types.
Otherwise, you are simply working with JSON. All the usual tools apply, e.g.:

```typescript
import { TokenList, schema } from '@uniswap/token-lists'

// generate your token list however you like.
const myList: TokenList = generateMyTokenList();

// use a tool like `ajv` to validate your generated token list
validateMyTokenList(myList, schema);

// print the resulting JSON to stdout
process.stdout.write(JSON.stringify(myList));
```

## Semantic versioning

Lists include a `version` field, which follows [semantic versioning](https://semver.org/).

List versions must follow the rules:

- Increment major version when tokens are removed
- Increment minor version when tokens are added
- Increment patch version when tokens already on the list have minor details changed (name, symbol, logo URL, decimals)

Changing a token address or chain ID is considered both a remove and an add, and should be a major version update.

Note that list versioning is used to improve the user experience, but not for security, i.e. list versions are not meant
to provide protection against malicious updates to a token list; i.e. the list semver is used as a lossy compression
of the diff of list updates. List updates may still be diffed in the client dApp.

## Deploying your list

Once you have authored the list, you can make it available at any URI. Prefer pinning your list to IPFS 
(e.g. via [pinata.cloud](https://pinata.cloud)) and referencing the list by an ENS name that resolves to the 
[contenthash](https://eips.ethereum.org/EIPS/eip-1577).

If hosted on HTTPS, make sure the endpoint is configured to send an access-control-allow-origin header to avoid CORS errors.

### Linking an ENS name to the list

An ENS name can be assigned to an IPFS hash via the [contenthash](https://eips.ethereum.org/EIPS/eip-1577) text record.
This is the preferred way of referencing your list.

## Examples

You can find a simple example of a token list in [test/schema/example.tokenlist.json](test/schema/example.tokenlist.json).

A snapshot of the Uniswap default list encoded as a token list is found in [test/schema/bigexample.tokenlist.json](test/schema/bigexample.tokenlist.json).
