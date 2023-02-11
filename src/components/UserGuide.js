import "../css/userGuide.css";

export const UserGuide = () => {
  return (
    <div className="userGuidePage">
      <div className="userGuideContainer">
        <p className="title">CashStream User Guide</p>

        <div className="entry">
          <p className="entryHeader">Frequently Asked Questions</p>
          <div className="entryContent">
            <a href="#start">How can I get a Metamask wallet?</a><br/>
            <a href="#wrap">Why do I have to wrap my tokens before opening a stream?</a><br/>
            <a href="#wrap">What is a difference between a token and a wrapped token?</a><br/>
            <a href="#wrap">What is allowance and why do I have to set it?</a><br/>
            <a href="#stream">Which tokens can be transferred?</a><br/>
            <a href="#stream">How can I open a new stream?</a><br/>
          </div>
        </div>

        <div id="start" className="entry">
          <p className="entryHeader">Getting Started</p>
          <div className="entryContent">
            <p className="emphasize">First, you will need to have a <a href="https://metamask.io/">Metamask</a> virtual wallet in order to interact with the project.</p>
            <p>If you do not already have a Metamask wallet, you can download it as a browser extension for Chrome, Firefox, Brave, or Opera. 
            Metamask is a browser extension and digital wallet that allows you to interact with decentralized applications on the Ethereum blockchain. 
            It acts as a bridge between your browser and the Ethereum network, and allows you to securely store and manage your private keys.</p>      
            <p>Once you have installed Metamask, open the extension and create a new wallet. 
              Make sure to securely store your seed phrase as it will be used to recover your account.</p>
            <p>To connect your Metamask wallet to the project, simply click the connect button or Metamask extension and select the account you want to use. 
              The project will automatically detect your account and you will be able to interact with it.</p>
          </div>
        </div>

        <div id="wrap" className="entry">
          <p className="entryHeader">Wrap &amp; Unwrap</p>
          <div className="entryContent">
            <p className="emphasize">Before sending streams, users must first wrap their tokens.</p> 
            <p><span className="emphasize">Wrapping tokens is the process of converting regular tokens into a special type of token called wrapped tokens.</span> These wrapped tokens are used to interact with different protocols and can be unwrapped back into regular tokens at any time. 
            Wrapped tokens provides these ERC-20 tokens with additional functionality, in this case providing the interoperability to be streamed. 
            A small gas fee will be charged when wrapping or unwrapping tokens.</p>

            <p className="emphasize">When wrapping fDAI, users must also set an allowance for the smart contract to access and manage their wrapped tokens.</p> 
            <p>This is an important security measure as it ensures that the smart contract does not have unlimited access to the user's assets. 
            The allowance can be easily modified or revoked by the user at any time.</p>
            <p>There is no allowance for ETH, an etherium native token.</p>
          </div>
        </div>

        <div id="stream" className="entry">
          <p className="entryHeader">Sending Streams</p>
          <div className="entryContent">
            <p>Through our platform, you can initiate a payment stream for recurring payments. 
              In this way, money is constantly being streamed (at regular intervals &lt;3 seconds), from you to the recepient. 
              <span className="emphasize"> You can send payments in Ethereum (ETH) or a stablecoin (DAI).</span></p>
            <p>Once you have wrapped your tokens, you can use our platform to create a new payment stream. 
              This functionality requires the following parameters: the recipient's Ethereum address, the amount of tokens to be sent, and the interval duration or the time to stop the stream.</p>
            
            <p>Once the payment stream is created and the smart contract has been approved, payments will automatically be sent at the specified intervals.
              The recipient can then access the received tokens by unwrapping them.</p>
            
            <p>It's worth noting that payment streams are useful in scenarios where a sender wants to make regular payments to a recipient, such as for subscription services or rent payments. CashStream enables these payments to be made automatically and securely using smart contracts on the Ethereum blockchain.</p>

            <p>There are some limits when creating a new stream. 
              First, there can be <span className="emphasize">only one active stream between two accounts.</span> There is also <span className="emphasize">a maximum and minimum limit on the flowrate.</span></p>

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

            <p>The maximum amount ensures that the protocol does not recieve values greater than 2<sup>53</sup>-1, the <code>MAX_SAFE_INTEGER</code> in <code>javascript</code>. 
            Amount smaller than the minimum amount will round down to zero when converted to wei, the smallest unit in cryptocurrency.</p>
          </div>
        </div>
      </div>
    </div>
  )
}