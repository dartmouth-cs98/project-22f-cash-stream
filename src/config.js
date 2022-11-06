export const Framework = require("@superfluid-finance/sdk-core");
export const ethers = require("ethers");

// Ethers.js provider initialization
export const url = process.env.URL;
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
