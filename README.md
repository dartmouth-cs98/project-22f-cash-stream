# Cash Stream

## The Problem 

The introduction of Software-as-a-Service (SaaS) in the early 2000s changed the way we interact and utilize software. Salesforce, NetSuite, WebEx, and ADP are just some of the early companies to make headway in this paradigm shift in the early 2000s, onboarding users and corporations to their offerings using SaaS subscriptions.

Gradually, the industry saw a shift from the status quo - users and businesses being priced out due to large upfront licensing fees - to digestible monthly payments that drastically transformed the landscape. On the consumer end, software tools became more accessible and affordable for users, driving an increase in adoption rates. Software providers could now rely on consistent recurring revenue to fuel growth and scale exponentially faster than what was previously possible. Fast forward two decades later and from Netflix, Amazon Prime, Spotify, to dozens of others, the SaaS subscription model is ubiquitous in our access to technology, and by extension our lives.

Now, we’re looking to push the boundaries and take SaaS one step further. Introducing CashStream: payments by the second.

CashStream is a blockchain-based web application for initiating recurring SaaS payments, paid out by the second. Using a payment “stream”, you can send and receive incremental payment distributions paid out every second. The funds are constantly streamed between the senders and recipients crypto wallets in Ethereum or DAI, a stablecoin pegged to the US dollar ($1 DAI ≈ $1 USD).

Check out our website http://cashstreamcrypto.com/ to learn more. Or, if you’re ready to get started, go directly to our browser-based application https://cash-stream.surge.sh/.

CashStream was born out of a capstone project by 4 undergraduate seniors studying computer science at Dartmouth College. It arose out of an organic need when they tried to set up recurring payments for crypto-native applications. Surprisingly, they found no real platforms available. Even after incessantly trying their best to work with any alternatives, they came across tools that were ineffective, lacked functionality, and failed at the universality of payment abstraction. Failing to find a solution, they decided to create their own.

How do I use CashStream?
Using our platform, you can initiate recurring payment streams in ETH or DAI in 3 easy steps. For a more comprehensive guide on how to get connected and interact with CashStream, check out our in-depth guide here.

Step 1: Connect Wallet
![image](https://user-images.githubusercontent.com/66996976/224797982-4b387215-0dc0-4858-8c29-12039f05448c.png)

Step 2: Wrap Tokens
![image](https://user-images.githubusercontent.com/66996976/224798017-f0d5f34f-52b8-4d96-9430-b1ff174b69cc.png)

Step 3: Send Stream
![image](https://user-images.githubusercontent.com/66996976/224798069-ea64f385-02f0-4b4b-9449-dfec7b8697eb.png)
![image](https://user-images.githubusercontent.com/66996976/224798094-406d1209-1971-4ee9-b500-b71b57d39afe.png)

That’s it! In less than a minute you can start streaming payments to friends, family, and businesses. We’ve provided one easy-to-navigate dashboard to wrap tokens, send streams, and manage recurring crypto payments. Check out our demo below:

https://youtu.be/vuUaWLgXx30

CashStream was born out of a capstone project by 4 undergraduate seniors studying computer science at Dartmouth College. It arose out of an organic need when they tried to set up recurring payments for crypto-native applications. Surprisingly, they found no real platforms available. Even after incessantly trying their best to work with any alternatives, they came across tools that were ineffective, lacked functionality, and failed at the universality of payment abstraction. Failing to find a solution, they decided to create their own.

It includes a [mock subscription service](https://spotify-3-0.onrender.com/) to demo "pay as you go" proof of concept. The service will be available only if the user opens a stream to the designated recipient address (0x45c01ceb87dbe6807ebecb9161408fc5c6acb5d1).

CashStream uses the Superfluid Protocol. [Superfluid](https://www.superfluid.finance/) is a De-Fi company working to enable money streaming in subscriptions, investment, etc.

Checkout a [short video demo](https://www.youtube.com/watch?v=vuUaWLgXx30&t=64s) of our project!

Read more about our project from our Medium Articles!

[CashStream: Recurring Payments by the Second](https://medium.com/dartmouth-cs98/recurring-payments-by-the-second-da7173080cee)

[CashStream Quickstart and Technical Guide](https://medium.com/@sunint.s.bindra.22/cashstream-quickstart-and-technical-guide-4ddf59baca15)

## Architecture

CashStream is a React-based web application. On the frontend, we use React, HTML, CSS, Redux, and JavaScript.

On the backend, we use GraphQL (a data query language) to interact with the blockchain to retrieve data. We also leverage the Superfluid SDK Core (https://docs.superfluid.finance/superfluid/). Superfluid is a smart contract framework on the Ethereum Virtual Machine (EVM) for decentralized finance (DeFi) applications. It provides a SDK core — a JS/TS wrapper library that enables frontend developers to use Superfluid without prior Solidity experience.

We are integrated with popular wallets like MetaMask using the MetaMask API and WalletConnect using WAGMI, through which we use React Hooks to process transactions and gas fees with the Ethereum blockchain. 

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

Builds the app for production to the build folder.
```
yarn build
```

Run the app in the development mode.
```
yarn start
```

## Use Cases
We envision 5 groups of use-cases for CashStream

Bringing recurring payments to crypto-native applications
Explosive growth of the Web3 economy is predicated on ease of recurring payments. Presently, it's inaccessible to use crypto to pay a recurring SaaS subscription for crypto-native applications. For crypto-native applications aiming to onboard paid users, having users pay a recurring fee is preferred than a one time expensive license. As explained earlier, the SaaS model has been immensely successful at increasing accessibility and affordability of software, thereby increasing the # of users willing to try new apps and tools. By enabling recurring payments for crypto-native applications, we believe we can help facilitate a similar exponential adoption rate in the crypto ecosystem.

Importantly, you only pay a gas fee when initiating and stopping the payment stream. A gas fee is a blockchain transaction fee, paid to validate transactions on the ledger. For crypto-native applications every transaction, such as each monthly subscription payment, requires a gas fee. For an annual subscription paid out monthly, instead of paying 12 gas fees like you do today, you only have to pay twice (once to initiate the stream and once to cancel). Thus, we meaningfully reduce transaction costs for users interacting with crypto-native applications.

Subscriptions
Subscriptions is one of the use cases we’re most excited for. Just as monthly SaaS subscriptions were the successor to the one-time licensing fee model, we’re confident our “payment by the second” model is next up in the lineage. By consistently streaming the payment, you minimize the upfront cost to the user and smooth out the revenue curve for the business, in addition to providing them an arbitrage opportunity.

In the status quo, you pay $10/month for Netflix (and most other SaaS applications) at the start of the month even though you use their app throughout the entire month. With CashStream, SaaS apps can now accept streamed payments continuously through the month. This lowers the adoption barrier for users, as users don't front the entire $100 at the start of the month and instead even out the payments over the entire month. In the long run, you increase the adoption rate of new users willing to give your app a shot. Beyond a smoothing of the revenue curve, the value proposition to Netflix and any other SaaS app is that they can charge a premium on the arbitrage for providing you this flexibility. Instead of $10 upfront, they can charge a premium, say $11/month in a payment stream, thereby increasing revenue. We envision our “payment by the second” model as an additional alternative SaaS apps can offer, capturing users and market share that would otherwise be dropped.

Content LiveStreams - Twitch and YouTube Live
Livestreaming payments in a payments by the second model would be a valuable offering for platforms like YouTube Live and Twitch because it would allow content creators to earn revenue in real-time based on the engagement of their audience. Check out our Proof-of-Concept of this use case.

Traditionally, content creators on these platforms rely on ad revenue or donations from their viewers to earn money. However, these revenue streams are not always consistent or reliable. With the payments by the second model, viewers would pay a small fee for every minute or time interval they watch the livestream, and the content creator would earn a portion of that fee.

This model would provide several benefits to both content creators and viewers. For content creators, it would provide a steady stream of revenue that is directly tied to the engagement of their audience. Additionally, the payments by the second model could incentivize content creators to produce more engaging and interactive livestreams to keep their viewers watching for longer periods of time.

For viewers, the payments by the second model has a similar value prop to that for subscriptions — lower upfront cost compared to a donation or streamer subscription (the traditional payment method for Twitch/YouTube Live). Further, it provides a more direct and tangible way for viewers to support their favorite content creators. Instead of relying on ads or donations, viewers could show their support by simply watching the livestream for longer periods of time. Additionally, the payments by the second model could encourage content creators to produce higher quality and more engaging livestreams, which would benefit viewers as well.

Overall, the payments by the second model for livestreaming would be a valuable offering for platforms like YouTube Live and Twitch because it would provide a more reliable and direct revenue stream for content creators, while also providing a more tangible way for viewers to support their favorite creators.

P2P Payments
Whether it’s paying for extracurricular lessons, rent, social outings, etc., presently one user is fronting the cost and is essentially holding the debt till their friends Venmo them. Providing a peer-to-peer crypto payments stream helps to match usage while the lesson or rental lease is taking place. Instead of stressing if your roommates will Venmo or PayPal their portion of the rent at the end of the month, they can stream their payment throughout the entire month so you can be sure you’re not on the hook for everyone’s lease when your landlord comes banging on the door. We abstract out the wrapping process to simplify access for casual users. Crypto is simply the medium for payments, and we aim to make P2P payments accessible to all users regardless of familiarity with crypto.

B2B and payroll payments
A handful of other interesting use cases include B2B payments for things like vendors and employee payroll.

Employee Payroll: For hourly employees who check in and out at a set time, streaming payments through their shift aligns incentives and matches their contribution, and can also help to manage discrepancies that arise.

B2B and vendor payments: Oftentimes, contracts with vendors are paid out in multiple fixed installments (% upfront, during the project, and at completion). Similar to employee payroll, streaming payments would mitigate outstanding accounts payable/receivables, as well as smooth over expense curves.

## Deployment

[Working URL](https://cash-stream.surge.sh/) 

## Other
[CashStream: Recurring Payments by the Second](https://medium.com/dartmouth-cs98/recurring-payments-by-the-second-da7173080cee)

[CashStream Quickstart and Technical Guide](https://medium.com/@sunint.s.bindra.22/cashstream-quickstart-and-technical-guide-4ddf59baca15)

[Landing Page](http://cashstreamcrypto.com)

[EtherStream Demo](https://spotify-3-0.onrender.com/)

[EtherStream GitHub](https://github.com/thanvinhbaohoang/Spotify-3.0)

## Authors

Tai Wan Kim, Harold Than, Jason Wang, Sunint Bindra

## Acknowledgements

[Superfluid](https://docs.superfluid.finance/superfluid/)

[Superfluid SDK Core](https://docs.superfluid.finance/superfluid/developers/sdk-core)
