const fs = require('fs');
const Ajv = require('ajv');
const addFormats = require("ajv-formats")
const addressListSchema = require('../src/addresslist.schema.json');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv)
const validate = ajv.compile(addressListSchema);

const name = "My Address List"
const dateTime = new Date().toISOString()

let addressList = {
  "name": name,
  "timestamp": dateTime,
  "version": {
    "major": 1,
    "minor": 0,
    "patch": 0
  },
  "addresses": []
}


// for (let i = 0; i < pendingTx.length; i++) {
// // Validate address + EOA
// // Construction Address List


// }

const valid = validate(addressList)
if (!valid) {
  console.log('Not valid')
} else {
  console.log('Valid Address List')

  // Write to file
  fs.writeFileSync(__dirname + `/../lists/${'testList.json'}`, JSON.stringify(addressList), { flag: 'w' });

  console.log(`List created`)
}