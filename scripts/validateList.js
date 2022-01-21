const Ajv = require('ajv');
const addFormats = require("ajv-formats")
const tokenListSchema = require('../src/tokenlist.schema.json');
const addressListSchema = require('../src/addresslist.schema.json');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv)

// Address Lists
const targetAddressList = require('../test/addressListTests/example.addresslist.json');
// const targetAddressList = require('../test/schema/invalidversion.1.tokenlist.json');

// Token Lists
// const targetTokenList = require('../test/schema/example.tokenlist.json');
// const targetTokenList = require('../test/schema/invalidversion.1.tokenlist.json');
// const validate = ajv.compile(tokenListSchema);


const validate = ajv.compile(addressListSchema);


// const response = await fetch('https://bridge.arbitrum.io/token-list-42161.json')
// const listData = await response.json()

const valid = validate(targetAddressList)
if (!valid) {
	console.log('Not valid')
} else {
  console.log('Valid')
}


// Read CSV file

// Validate address + EOA

// Construction Address List

// Validate againist schema