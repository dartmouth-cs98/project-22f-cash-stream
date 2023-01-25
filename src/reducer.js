/*
 * Reducer for our app. We pass no initial state because there is no wallet connected initially.
 */
export default function appReducer(state = [], action) {

  switch (action.type) {
    case 'wallet/connect':
      // Update wallet state here with the action.payload
      console.log(state)
      console.log(action.payload)
      state = action.payload
    // Do something here based on the different types of actions
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state
  }
}