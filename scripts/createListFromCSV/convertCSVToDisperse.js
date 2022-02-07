require('dotenv').config()
const csvtojson = require('csvtojson');
const fetch = require('node-fetch');
const ethers = require('ethers');
const _ = require('lodash');

// const generateAddressList = require('./generateAddressList');
// const fetchTwitterUsernames = require('./fetchTwitterUsernames');

convertCSVToDisperse(process.argv[2])

async function convertCSVToDisperse(path='') {
  const csvPath = `${__dirname}/${path}`

  // Parse CSV
  const converter = csvtojson({
    delimiter: [","],
    noheader: false,
    trim: true,
  });
  const parsed = await converter.fromFile(csvPath);

  // Get AAVE Token Price

  // Convert to AAVE Tokens
  // 

  console.log(parsed)

  const aaveTokenAddr = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
  const chainLinkAddr = "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9"
  const roundData = await getTokenPrice(chainLinkAddr)

  console.log(roundData)
  console.log(roundData.answer.toString())
  console.log('-------------')
  console.log('-------------')

  for (let i = 0; i < parsed.length; i++) {
    let usdAmt = _.replace(_.replace(parsed[i]['Amount'],'$',''),',','')
    // console.log(usdAmt)
    // console.log(roundData.answer.div(100000000))
    let tokenAmt = _.round(usdAmt / roundData.answer.div(100000000).toNumber(),4)
    // console.log(tokenAmt)
    console.log(`erc20,${aaveTokenAddr},${parsed[i]['ETH Address']},${tokenAmt}`)
  }

  parsed.forEach((a, i) => {



  });



}

async function getTokenPrice(addr, chain='eth') {
  const provider = getInfuraProvider()
  const chainLinkAggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
  const priceFeed = new ethers.Contract(addr, chainLinkAggregatorV3InterfaceABI, provider)

  const roundData = await priceFeed.latestRoundData()

  return roundData
}




  // 1) Get Twitter Users => Twitter APIs
  // 2) Get NFT pfp Info for User => Scraping / hacked API
  // 3) Get owner address for NFT pfp => Moralis API
  // 4) Generate AddressList => script
  // 5) Disperse Tokens to AddressList => Paymagic API

  // ----

  // 1) Get Twitter Users => Twitter APIs
  // const usernames = await fetchTwitterUsernames('Retweets', data)
  // console.log(`${usernames.length} Twitter Users found`)


  // // 2) Get NFT pfp Info for User => Scraping / hacked API
  // // 3) Get owner address for NFT pfp => Moralis API
  // const allValidUsers = await getNFTDataForTwitterUsers(usernames)
  // console.log(`${allValidUsers.length} Twitter Users with NFT PFPs`)


  // // 4) Generate AddressList => script
  // const addressList = await generateAddressList(
  //   `Twitter RTs for ${data}`,
  //   "NFT pfps that retweeted tweet",
  //   _.map(allValidUsers, 'owner'),
  //   _.map(allValidUsers, 'username'),
  //   [ "twitter-nft-pfps" ]
  // )
  // if(!_.isNull(addressList)) {
  //   const filename = `${addressList.name.replace(/[^a-zA-Z0-9]/g, '-')}.json`
  //   fs.writeFileSync(__dirname + `/lists/${filename}`, JSON.stringify(addressList), { flag: 'w' });
  //   // console.log(addressList)
  //   // console.log(_.map(addressList.addresses,'address'))

  //   console.log('-----')
  //   console.log(_.map(addressList.addresses,'address'))

  //   // 5) Disperse Tokens to AddressList => Paymagic API
  //   // TBD

//   }
// };




// async function getNFTDataForTwitterUsers(usernames=[]) {
//   let allUserNftData = []
//   let userNftData = []
//   for (let i = 0; i < usernames.length; i++) {
//     allUserNftData[i] = await getNFTDataForTwitterUser(usernames[i])

//     if(allUserNftData[i].has_nft_avatar) {
//       const type = allUserNftData[i].nft_avatar_metadata.smart_contract.__typename
//       const tokenAddress = allUserNftData[i].nft_avatar_metadata.smart_contract.address
//       const tokenId = allUserNftData[i].nft_avatar_metadata.token_id

//       const owner = await getTokenOwner(
//         type,
//         tokenAddress,
//         tokenId
//       )

//       // Check for EOA

//       userNftData.push({
//         username: usernames[i],
//         hasNftAvatar: allUserNftData[i].has_nft_avatar,
//         owner: owner,
//         contractType: type,
//         tokenAddress: tokenAddress,
//         tokenId: tokenId
//       })
//     } else {
//       // User doesn't have a verified NFT pfp
//       console.log(`No NFT PFP: ${usernames[i]}`)
//     }
//   }

//   return userNftData
// }

// async function getNFTDataForTwitterUser(username) {
//   const response = await fetch(
//     `https://twitter.com/i/api/graphql/2WV2fm-gpUaL85bIxx14vQ/userNftContainer_Query?variables=%7B%22screenName%22%3A%22${username}%22%7D`,
//     {
//     "headers": {
//       "accept": "*/*",
//       "accept-language": "en-US,en;q=0.9",
//       "authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN_NFT}`,
//       "content-type": "application/json",
//       "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": "\"macOS\"",
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "same-origin",
//       "x-csrf-token": "ceb8fa065b92131e8a77705366b412d0586b7887a41e364e06a6275687a15bb8337d45aacc531f94c2b520c45cd7767e50517d48133aacaebe2d819ef6733472ff8d340e5c41c3d8ac3c2d7a90a4b58a",
//       "x-twitter-active-user": "yes",
//       "x-twitter-auth-type": "OAuth2Session",
//       "x-twitter-client-language": "en",
//       "cookie": "dnt=1; kdt=Wf3V8dpd57skbBzMpSuzeMw86cvFruy6iyYormQK; remember_checked_on=1; cd_user_id=177a379a70d616-0be067a531d0e-33677509-13c680-177a379a70eae4; guest_id_marketing=v1%3A163241988813829095; guest_id_ads=v1%3A163241988813829095; lang=en; _gid=GA1.2.851316920.1642799438; auth_multi=\"1394379116296736770:60b596f683687d4f814ba9125183f20376f258c4\"; auth_token=fd07373ecb7c70ac92c17842b4b57d63fa96a2d8; personalization_id=\"v1_nvVfzBAzNrbjX1mG6Y+FHg==\"; guest_id=v1%3A164280007695632154; twid=u%3D1128490279722455041; ct0=ceb8fa065b92131e8a77705366b412d0586b7887a41e364e06a6275687a15bb8337d45aacc531f94c2b520c45cd7767e50517d48133aacaebe2d819ef6733472ff8d340e5c41c3d8ac3c2d7a90a4b58a; at_check=true; des_opt_in=Y; _gcl_au=1.1.1184911266.1642800142; mbox=PC#a900969a8918497ea6d644b45ff0522a.34_0#1706045331|session#1ac8b3490dd34501bea5fb010bffea67#1642802391; _ga_34PHSZMC42=GS1.1.1642869572.2.1.1642869573.0; _ga=GA1.2.1471225860.1605280158; external_referer=padhuUp37zjgzgv1mFWxJ12Ozwit7owX|0|8e8t2xd8A2w%3D",
//       "Referer": `https://twitter.com/${username}/nft`,
//       "Referrer-Policy": "strict-origin-when-cross-origin"
//     },
//     "body": null,
//     "method": "GET"
//   });

//   const res = await response.json()

//   const userInfo = _.get(res, 'data.user.result', {has_nft_avatar: false})

//   return userInfo
// }

// async function getMoralisNFTData(chain='eth', tokenAddress, tokenId) {
//   const options = {
//     method: 'GET',
//     headers: {
//       'accept': 'application/json',
//       'X-API-Key': process.env.MORALIS_ID
//     }
//   }

//   const response = await fetch(
//     `https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}/owners?chain=${chain}&format=decimal`,
//     options
//   )

//   const res = await response.json()

//   return res
// }

// async function getTokenOwner(type, tokenAddress, tokenId) {
//   const infuraProvider = getInfuraProvider()
//   let address = ''

//   // CryptoPunks doesn't use ERC721 so need Moralis
//   if(tokenAddress === '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb') {
//     // Query Moralis API
//     const res = await getMoralisNFTData('eth', tokenAddress, tokenId)
//     address = res.result[0]['owner_of']
//   } else if(type === 'ERC721') {
//     const contract = new ethers.Contract(
//         tokenAddress,
//         abis[type],
//         infuraProvider
//     );
//     address = await contract.ownerOf(tokenId)
//   } else if(type === 'ERC1155') {
//     // Query Moralis API
//     const res = await getMoralisNFTData('eth', tokenAddress, tokenId)
//     address = res.result[0]['owner_of']
//   }

//   return address
// }

// Returns the ethers infuraProvider for the given chain
function getInfuraProvider() {
  try {
    return new ethers.providers.InfuraProvider('homestead', process.env.INFURA_ID)
  } catch (err) {
    console.error(err);
    return null;
  }
}
