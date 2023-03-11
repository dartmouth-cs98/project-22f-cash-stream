import "../css/userGuide.css";

//FAQ Page
export const UserGuide = () => {
  return (
    <div className="userGuidePage">
      <div className="userGuideContainer">
        <p className="title">CashStream User Guide</p>

        <div className="entry">
          <p className="entryHeader">Frequently Asked Questions</p>
          <div className="entryContent">
            <a href="#faq1">How can I get a Metamask wallet?</a><br/>
            <a href="#faq2">Why do I have to wrap my tokens before opening a stream?</a><br/>
            <a href="#faq3">What is a difference between a regular token and a wrapped token?</a><br/>
            <a href="#faq4">What is allowance and why do I have to set it?</a><br/>
            <a href="#faq5">Can I track wrapped tokens through other services?</a><br/>
            <a href="#faq6">Which tokens can be transferred?</a><br/>
            <a href="#faq7">How can I open a new stream?</a><br/>
            <a href="#faq8">How does upfront buffer work?</a><br/>
          </div>
        </div>

        <div className="entry">
          <p className="entryHeader">Getting Started</p>
          <div className="entryContent">
            <p id="faq1" className="emphasize">First, you will need to have a <a href="https://metamask.io/" target="_blank">Metamask</a> virtual wallet in order to interact with the project.</p>
            <p>If you do not already have a Metamask wallet, you can download it as a browser extension for Chrome, Firefox, Brave, or Opera. 
            Metamask is a browser extension and digital wallet that allows you to interact with decentralized applications on the Ethereum blockchain. 
            It acts as a bridge between your browser and the Ethereum network, and allows you to securely store and manage your private keys.</p>      
            <p>Once you have installed Metamask, open the extension and create a new wallet. 
              Make sure to securely store your seed phrase as it will be used to recover your account.</p>
            <p>To connect your Metamask wallet to the project, simply click the connect button or Metamask extension and select the account you want to use. 
              The project will automatically detect your account and you will be able to interact with it.</p>
          </div>
        </div>

        <div className="entry">
          <p className="entryHeader">Wrap &amp; Unwrap</p>
          <div className="entryContent">
            <p id="faq2" className="emphasize">Before sending streams, users must first wrap their tokens.</p> 
            <p id="faq3"><span className="emphasize">Wrapping tokens is the process of converting regular tokens into a special type of token called wrapped tokens.</span> These wrapped tokens are used to interact with different protocols and can be unwrapped back into regular tokens at any time. 
            Wrapped tokens provides these ERC-20 tokens with additional functionality, in this case providing the interoperability to be streamed. 
            A small gas fee will be charged when wrapping or unwrapping tokens.</p>

            <p id="faq4" className="emphasize">When wrapping fDAI, users must also set an allowance for the smart contract to access and manage their wrapped tokens.</p> 
            <p>This is an important security measure as it ensures that the smart contract does not have unlimited access to the user's assets. 
            The allowance can be easily modified or revoked by the user at any time.</p>
            <p>There is no allowance for ETH, an etherium native token.</p>

            <p id="faq5">To learn more about wrapped tokens, you can look up the contract for ETHx and fDAIx on <a href="https://goerli.etherscan.io/" target="_blank">Etherscan</a>.</p>
            <p>In order to track your wrapped token balance you can <a href="https://support.metamask.io/hc/en-us/articles/360015489031-How-to-display-tokens-in-MetaMask#h_01FWH492CHY60HWPC28RW0872H" target="_blank">import custom tokens</a> on Metamask extension.
            The contract address is as follows:</p> 
            <p>ETHx: 0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947</p>
            <p>fDAIx: 0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00</p>
          </div>
        </div>

        <div id="faq7" className="entry">
          <p className="entryHeader">Sending Streams</p>
          <div className="entryContent">
            <p id="faq6">Through our platform, you can initiate a payment stream for recurring payments. 
              In this way, money is constantly being streamed (at regular intervals &lt;3 seconds), from you to the recepient. 
              <span className="emphasize"> You can send payments in Ethereum (ETH) or a stablecoin (DAI).</span></p>
            <p>Once you have wrapped your tokens, you can use our platform to create a new payment stream. 
              This functionality requires the following parameters: the recipient's Ethereum address, the amount of tokens to be sent, and the interval duration or the time to stop the stream.</p>
            
            <p>Once the payment stream is created and the smart contract has been approved, payments will automatically be sent at the specified intervals.
              The recipient can then access the received tokens by unwrapping them.</p>
            
            <p>It's worth noting that payment streams are useful in scenarios where a sender wants to make regular payments to a recipient, such as for subscription services or rent payments. CashStream enables these payments to be made automatically and securely using smart contracts on the Ethereum blockchain.</p>

            <p>There are some limits when creating a new stream. 
              First, there can be <span className="emphasize">only one active stream between two accounts for each token.</span> There is also <span className="emphasize">a maximum and minimum limit on the flowrate.</span></p>

            <table>
              <thead>
                <tr>
                  <th>Interval</th>
                  <th>Max Amount</th>
                  <th>Min Amount</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td>/ hour</td>
                <td>1.8 x 10<sup>-15</sup></td>
                <td>32</td>
              </tr>
              <tr>
                <td>/ day</td>
                <td>4.3 x 10<sup>-14</sup></td>
                <td>778</td>
              </tr>
              <tr>
                <td>/ month</td>
                <td>1.3 x 10<sup>-12</sup></td>
                <td>2334666</td>
              </tr>
              </tbody>
            </table>

            <p id="faq8">The maximum amount ensures that the protocol does not recieve values greater than 2<sup>53</sup>-1, the <code>MAX_SAFE_INTEGER</code> in <code>javascript</code>. 
            Amount smaller than the minimum amount will round down to zero when converted to wei, the smallest unit in cryptocurrency.</p>

            <p>When a user opens a stream, the protocol will take an upfront buffer, an amount equivalent to one hour's flow for the given flowrate.
            You will not be able to open a stream if your wrapped token balance is less than the buffer. You may lose your buffer if you fail to close your stream before your balance reaches zero.</p>
          </div>
        </div>
      </div>
    </div>
  )
}