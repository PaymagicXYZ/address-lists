const fs = require('fs');
const ethers = require('ethers');
const _ = require('lodash');
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
    addressTags=[],
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

    if(isAddress(checkAddress(addresses[i]))) {
      const tmp = checkAddress(addresses[i])

      const isSmartContract = await isSmartContractWallet(tmp, [1])

      addressList.addresses.push({
        address: tmp,
        chainId: isSmartContract ? 1 : 0,
        name: addressNames[i],
        tags: isSmartContract ? addressTags : _.concat(addressTags,'EOA')
      })
    } else {
      console.log(`Invalid address, skipping: ${addresses[i]}`)
    }
  }

  const valid = validate(addressList)
  if (!valid) {
    console.log('Not valid')
  } else {
    console.log('Valid Address List')
  }
  return addressList
}


// returns the checksummed address if the address is valid, otherwise returns false
const isAddress = (value) => {
  try {
    return ethers.utils.isAddress(value);
  } catch {
    return false;
  }
}

// returns the checksummed address if the address is valid, otherwise returns input
const checkAddress = (value) => {
  try {
    return getAddress(value);
  } catch {
    return value;
  }
}

async function isSmartContractWallet(address, chainIds) {
  isSmartContract = false

  if(isAddress(checkAddress(address))) {
    // Check for data on all included Chains

    for (let i = 0; i < chainIds.length; i++) {
      const infuraProvider = getInfuraProvider(chainIds[i])
      const code = await infuraProvider.getCode(address);

      isSmartContract = (code !== '0x')
    }
  }

  return isSmartContract
}

// Returns the ethers infuraProvider for the given chain
function getInfuraProvider(chainId=1) {
  try {
    const infuraChain = returnNetworkForChainId[chainId]
    return new ethers.providers.InfuraProvider(infuraChain, process.env.INFURA_ID)
  } catch (err) {
    console.error(err);
    return null;
  }
}

const returnNetworkForChainId = {
  1: 'homestead'
}