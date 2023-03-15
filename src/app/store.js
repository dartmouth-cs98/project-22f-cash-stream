import { configureStore } from '@reduxjs/toolkit'
import appReducer from '../reducer.js'
/* 
 * Broad overview of plan. 

 * persist this data pulled from connect wallet to store.
        console.log(recipient);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);

        const signer = provider.getSigner();
        console.log(signer);

        const chainId = await window.ethereum.request({ method: "eth_chainId" });

        const sf = await Framework.create({
            chainId: Number(chainId),
            provider: provider
        });
 * Will likely require a redux slicer
 *
 */

export default configureStore({
  //...
  reducer: {appReducer},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
          // Ignore these action types
          ignoredActions: ['wallet/connect'],
          // // Ignore these field paths in all actions
          // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
          // // Ignore these paths in the state
          ignoredPaths: ['appReducer', 'appReducer.provider'],
      // reduxImmutableStateInvariant()
      },
      // reduxImmutableStateInvariant({
      //   ignore: [
      //     'trackProperties',
      //   ]
      // })
    }),
})