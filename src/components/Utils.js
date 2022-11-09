import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

/* 
* Returns tuple of signer and superfluid framework object. 
* Used in both creating and deleting flow.
* @param {Window} window - window object containing Metamask wallet, etc
* @return {tuple} signer, sf
*/ 
export const getSfFramework = async (window) => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    console.log(signer._address);

    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider
    });

    return signer, sf;
}