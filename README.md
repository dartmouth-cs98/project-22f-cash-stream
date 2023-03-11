# Cash Stream

CashStream is a React web application to facilitate real-time crypto payment. It allows the user to open a continuous "stream" from one wallet address to another, where crypto assets will be transferred in real-time.

Our application is built for **Goerli Testnet**. It works for two Ethereum-based tokens, **ETH and fDAI (stablecoin)**.

It includes a [mock subscription service](https://spotify-3-0.onrender.com/) to demo "pay as you go" proof of concept. The service will be available only if the user opens a stream to the designated recipient address.

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
git clone https://github.com/dartmouth-cs98/project-22f-cash-stream.git
```
Navigate to repo
```
cd project-22f-cash-stream 
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

[Working URL](https://cash-stream.surge.sh/) 

## Other

[Landing Page](http://cashstreamcrypto.com)

[EtherStream Demo](https://spotify-3-0.onrender.com/)

[EtherStream GitHub](https://github.com/thanvinhbaohoang/Spotify-3.0)

## Authors

Tai Wan Kim, Harold Than, Jason Wang, Sunint Bindra

## Acknowledgements

[Superfluid](https://docs.superfluid.finance/superfluid/)

[Superfluid SDK Core](https://docs.superfluid.finance/superfluid/developers/sdk-core)
