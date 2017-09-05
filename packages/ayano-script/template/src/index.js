import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Toast, Popup } from 'antd-mobile';
import { createApp } from './package/index.js';
import reducers from './scripts/reducers';
import Home from './views/Home/Home.js';
import './index.scss';

const routers = [{
  path: '/',
  component: Home
}]

const app = createApp({ reducers, routers });

app.start(document.querySelector('#root'));
