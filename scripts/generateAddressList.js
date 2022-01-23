const fs = require('fs');
const csvtojson = require('csvtojson');
const Ajv = require('ajv');
const addFormats = require("ajv-formats")
const addressListSchema = require('../src/addresslist.schema.json');
// const addressInputCsv = require('../test/csv/input.csv');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv)
const validate = ajv.compile(addressListSchema);

module.exports = async function generateAddressList(
  name,
  description="",
  addresses=[],
  addressNames=[],
  ) {
  const dateTime = new Date().toISOString()
  let addressList = {
    name: name,
    description: description,
    timestamp: dateTime,
    version: {
      major: 1,
      minor: 0,
      patch: 0
    },
    addresses: []
  }

  for (let i = 0; i < addresses.length; i++) {

    // Validate address + EOA

    addressList.addresses.push({
      address: addresses[i],
      chainId: 0,
      name: addressNames[i],
      tags: [
        "twitter-nft-pfp"
        // "EOA" // conditionally
      ]
    })
  }

  const valid = validate(addressList)
  if (!valid) {
    console.log('Not valid')
  } else {
    console.log('Valid Address List')
    console.log(addressList)
    console.log(`List created`)
  }

  return addressList
}