import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from "react-router-dom"
import {createBrowserHistory} from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import { rootReducer } from './redux/rootReducer'
import App from './App'
import thunk from 'redux-thunk';
import { InitAPP } from './redux/actions'

const history = createBrowserHistory()
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
   )
)
store.dispatch(InitAPP())
 
ReactDOM.render((
  <Provider store={store} >
   <Router history={history}>
     <App/>
   </Router>
   </Provider>
 ), document.getElementById('root') 
);