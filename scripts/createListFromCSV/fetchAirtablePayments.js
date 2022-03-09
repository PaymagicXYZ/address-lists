const _ = require('lodash');
const axios = require('axios');
const Airtable = require('airtable');

const AIRTABLE_BEARER_TOKEN = process.env.AIRTABLE_BEARER_TOKEN

module.exports = fetchAirtableRecords

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: AIRTABLE_BEARER_TOKEN
});

async function fetchAirtableRecords() {
  let airtableResults = []
  let base = Airtable.base('appaRxFAe60G0zJJH');

  return base('Payments').select({
    maxRecords: 100,
    view: "Pending"
  }).firstPage()
}





