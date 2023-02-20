# Cash Stream

https://cash-stream.surge.sh/ 

CashStream is a React web application to facilitate real-time crypto payment. It allows the user to open a "stream" from one wallet address to another, where crypto assets will be transferred in real-time each second.

Our application is built for **Goerli Testnet**. It works for two Ethereum-based tokens, **ETH and fDAI**.

It includes a small demo with a mock Spotify page to suggest how money streaming could be used for recurrent payments.

CashStream uses the Superfluid Protocol. [Superfluid](https://www.superfluid.finance/) is a De-Fi company working to enable money streaming in subscriptions, investment, etc.

## Architecture

Front End: React, HTML, CSS, javascript

Back End:
* Superfluid SDK Core: [Superfluid](https://docs.superfluid.finance/superfluid/) is a smart contract framework on EVM that enables money streaming.
It provides a [SDK core](https://docs.superfluid.finance/superfluid/developers/sdk-core), a JS/TS wrapper library that enables Front End developers to use Superfluid without prior Solidity experience.
* GraphQL: GraphQL is a data query language we use to interact with blockchain to retrieve data.

## Setup

Clone repo with
```
git clone https://github.com/dartmouth-cs98/project-22f-zk-vote.git
```
Navigate to repo
```
cd project-22f-zk-vote 
```
Install, build, and run program
```
yarn install
```
```
yarn build
```
```
yarn start
```

## Deployment

## Other

[Spotify 3.0 Demo](https://spotify-3-0.onrender.com/)

[Spotify 3.0 Github](https://github.com/thanvinhbaohoang/Spotify-3.0)

[Landing Page](http://cashstreamcrypto.com)

## Authors

Sunint Bindra, Tai Wan Kim, Harold Than, Jason Wang

## Acknowledgements

[Superfluid](https://docs.superfluid.finance/superfluid/)

[Superfluid SDK Core](https://docs.superfluid.finance/superfluid/developers/sdk-core)
