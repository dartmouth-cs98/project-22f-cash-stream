import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from './app/store'
import { Provider } from 'react-redux'

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  rootElement
);
