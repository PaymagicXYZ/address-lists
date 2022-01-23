const fs = require('fs');
const csvtojson = require('csvtojson');
const Ajv = require('ajv');
const addFormats = require("ajv-formats")
const addressListSchema = require('../src/addresslist.schema.json');
// const addressInputCsv = require('../test/csv/input.csv');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv)
const validate = ajv.compile(addressListSchema);

module.exports = (async () => {
  const addressInputCsv = await fs.readFileSync(
    __dirname + `/../test/csv/input.csv`,
     'utf8'
  )

  const converter = csvtojson({
    delimiter: [",", "|", " ", "="],
    noheader: true,
    trim: true,
  });

  let addressInput = await converter.fromString(addressInputCsv);
  const dateTime = new Date().toISOString()
  let addressList = {
    name: "Tweet RTs 1484530460051058692",
    description: "NFT pfps that retweeted tweet 1484530460051058692",
    timestamp: dateTime,
    version: {
      major: 1,
      minor: 0,
      patch: 0
    },
    addresses: []
  }


  for (let i = 0; i < addressInput.length; i++) {
  // Validate address + EOA
  // Construction Address List

    addressList.addresses.push({
      address: addressInput[i]["field2"],
      chainId: 0,
      name: addressInput[i]["field1"],
      tags: [
        "Twitter-NFT-PFP"
      ]
    })
  }

console.log(addressList)

  const valid = validate(addressList)
  if (!valid) {
    console.log('Not valid')
  } else {
    console.log('Valid Address List')

    // Write to file
    const filename = `${addressList.name.replace(/[^a-zA-Z0-9]/g, '-')}-${addressList.timestamp.replace(/[^a-zA-Z0-9]/g, '-')}.json`
    fs.writeFileSync(__dirname + `/../lists/${filename}`, JSON.stringify(addressList), { flag: 'w' });

    console.log(`List created`)
  }
})();

