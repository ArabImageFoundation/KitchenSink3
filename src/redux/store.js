import {compose, createStore, applyMiddleware } from 'redux';
import {persistState} from 'redux-devtools'
import thunkMiddleware from 'redux-thunk';
import DevTools from './devTools';

const createStoreWithMiddleware = (process.env.NODE_ENV === 'production') ?
	compose(
		applyMiddleware(thunkMiddleware)
	)(createStore):
	compose(
		applyMiddleware(thunkMiddleware)
	,	DevTools.instrument()
    ,	persistState(getDebugSessionKey())
	)(createStore);

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

export default function getStore(state){
	var reducer = require('./actionsReducer.js').default.reducer;
	var initialState = require('./initialState.js').default;
	var store = createStoreWithMiddleware(reducer,window.__INITIAL_STATE__||initialState);
	if(process.env.NODE_ENV !== 'production'){
		if(module.hot){
			module.hot.accept(['./actionsReducer.js','./initialState.js'], () => {
				var nextReducer = require('./actionsReducer.js').default.reducer;
				store.replaceReducer(nextReducer);
			});
		}
	}
	return store;
}
