require('dotenv').config()
const csvtojson = require('csvtojson');
const fetch = require('node-fetch');
const ethers = require('ethers');
const _ = require('lodash');

const fetchAirtablePayments = require('./fetchAirtablePayments');

createListFromAirtable()

async function createListFromAirtable(action='', data) {
	const records = await fetchAirtablePayments()
	console.log(records)

	const aaveTokenAddr = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
  const aavePriceFeedAddr = "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9"
  const roundData = await getTokenPrice(aavePriceFeedAddr)

  console.log(roundData)
  console.log(roundData.answer.toString())
  console.log('-------------')
  console.log('-------------')

  for (let i = 0; i < records.length; i++) {
    let usdAmt = records[i].get('Amount')
    let ethAddress = getChecksummedAddress(records[i].get('ETH Address'))

    // console.log(usdAmt)
    // console.log(roundData.answer.div(100000000))
    let tokenAmt = _.round(usdAmt / roundData.answer.div(100000000).toNumber(),4)
    // console.log(tokenAmt)
    console.log(`erc20,${aaveTokenAddr},${ethAddress},${tokenAmt}`)
  }

}

async function getTokenPrice(addr, chain='eth') {
  const provider = getInfuraProvider()
  const chainLinkAggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
  const priceFeed = new ethers.Contract(addr, chainLinkAggregatorV3InterfaceABI, provider)

  const roundData = await priceFeed.latestRoundData()

  return roundData
}

// Returns the ethers infuraProvider for the given chain
function getInfuraProvider() {
  try {
    return new ethers.providers.InfuraProvider('homestead', process.env.INFURA_ID)
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getChecksummedAddress(address) {
  if (!ethers.utils.isAddress(address)) return false;
  try {
    return ethers.utils.getAddress(address);
  } catch {
    return false;
  }
};

