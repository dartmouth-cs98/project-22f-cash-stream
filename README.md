# CashStream

[CashStream](https://cash-stream.surge.sh/) is a React web application to facilitate real-time crypto payment. It allows the user to open a continuous "stream" from one wallet address to another, where crypto assets will be transferred in real-time.

**Our application is built for Goerli Testnet. It works for two Ethereum-based tokens, ETH and fDAI (stablecoin).**

It includes [a mock subscription service](https://spotify-3-0.onrender.com/) to demo "pay as you go" proof of concept. The service will be available only if the user opens a stream to the designated recipient address (0x45c01ceb87dbe6807ebecb9161408fc5c6acb5d1). ([github repo](https://github.com/thanvinhbaohoang/Spotify-3.0))
We also have a proof of concept for livestreaming content, like YouTube Live, Twitch, OBS, etc., which a viewer gains access to by initiating a payment stream. [Video Demo](https://youtu.be/c1Is6b1py7A) and [Github](https://github.com/sunintb/streaming). 

CashStream uses the [Superfluid](https://www.superfluid.finance/) Protocol. Superfluid is a De-Fi company working to enable money streaming in subscriptions, investment, etc.

Checkout [a short video demo](https://www.youtube.com/watch?v=vuUaWLgXx30&t=64s) of our project! 

Read more about our project from our Medium article!

* [CashStream: Recurring Payments by the Second](https://medium.com/dartmouth-cs98/recurring-payments-by-the-second-da7173080cee)
* [CashStream Quickstart and Technical Guide](https://medium.com/@sunint.s.bindra.22/cashstream-quickstart-and-technical-guide-4ddf59baca15)

## Architecture

Front End: React, HTML, CSS, javascript

Back End:

* Superfluid SDK Core: Superfluid is a smart contract framework on EVM that enables money streaming. It provides a SDK core, a JS/TS wrapper library that enables developers to use Superfluid without prior Solidity experience.
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

Install all dependencies for the project
```
yarn install
```

Builds the app for production to the build folder
```
yarn build
```

Run the app in the development mode
```
yarn start
```

## Deployment

[Working URL](https://cash-stream.surge.sh/) 

## Other
[CashStream: Recurring Payments by the Second](https://medium.com/dartmouth-cs98/recurring-payments-by-the-second-da7173080cee)

[CashStream Quickstart and Technical Guide](https://medium.com/@sunint.s.bindra.22/cashstream-quickstart-and-technical-guide-4ddf59baca15)

[Landing Page](http://cashstreamcrypto.com)

[EtherStream Demo](https://spotify-3-0.onrender.com/)

[EtherStream GitHub](https://github.com/thanvinhbaohoang/Spotify-3.0)

[Devfolio](https://devfolio.co/projects/cashstream-16e9)

[Content Livestream Demo](https://youtu.be/c1Is6b1py7A) 

[Content Livestream Github](https://github.com/sunintb/streaming). 


## Authors

Tai Wan Kim, Harold Than, Jason Wang, Sunint Bindra

## Acknowledgements

[Superfluid](https://docs.superfluid.finance/superfluid/)

[Superfluid SDK Core](https://docs.superfluid.finance/superfluid/developers/sdk-core)
