const _ = require('lodash');
const axios = require('axios');

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN

module.exports = fetchTwitterUsernames

async function fetchTwitterUsernames(action='', data) {
  let usernames = []
  switch(action) {
    case 'Retweets':
      // Get regular RTs first
      let retweetedUsernames = await getRetweetUsernamesForTweet(_.toString(data))
      console.log(`${retweetedUsernames.length} Retweets`)


      // Get quoted RTs
      // let quotedUsernames = 
      let quotedUsernames = await getQuotedTweetUsernamesForTweet(_.toString(data))
      console.log(`${quotedUsernames.length} Quoted Tweets`)
      // console.log(`${quotedUsernames}`)

      // Add together and make unique
      usernames = _.uniq(_.concat(retweetedUsernames, quotedUsernames))
      console.log(`${usernames.length} Unique users RTs`)
      // console.log(usernames)

      break;
    default:
      console.log(`Action not supported: ${action}`)
  }

  return usernames
}

async function getRetweetUsernamesForTweet(tweetId) {
  const config = {
    method: 'get',
    url: `https://api.twitter.com/2/tweets/${tweetId}/retweeted_by?max_results=100`,
    headers: { 
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}` 
    }
  };

  const res = await axios(config)

  const usernames = _.map(res.data['data'], 'username')

  return usernames
}


async function getQuotedTweetUsernamesForTweet(tweetId) {
  const config = {
    method: 'get',
    url: `https://api.twitter.com/2/tweets/search/recent?query=url:"/status/${tweetId}" is:quote&max_results=100&tweet.fields=author_id`,
    headers: { 
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}` 
    }
  };

  const res = await axios(config)
  const authorIds = _.map(res.data['data'], 'author_id')

  const usernames = await getUsernamesForauthorIds(authorIds)
  return usernames
}

async function getUsernamesForauthorIds(authorIds) {
  const config = {
    method: 'get',
    url: `https://api.twitter.com/2/users?ids=${authorIds.join(',')}`,
    headers: { 
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`, 
    }
  };

  const res = await axios(config)

  const usernames = _.map(res.data['data'], 'username')

  return usernames
}
