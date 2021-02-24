import ReactDOM from 'react-dom';
import './adaptation.scss';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import Store from './redux/store';

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
