// Importing StrictMode and ReactDOM from the react package
import { StrictMode } from "react";
import ReactDOM from "react-dom";

// Importing the App component
import App from "./App";

// Importing the store from the app folder
import store from './app/store'

// Importing Provider from react-redux
import { Provider } from 'react-redux'

// Selecting the root element from the HTML file
const rootElement = document.getElementById("root");

// Rendering the App component inside a Provider component, wrapped in StrictMode, and attaching it to the root element
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  rootElement
);
