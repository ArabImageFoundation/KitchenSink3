import {camelCaseToCapitals,resolve,reject,assign} from '../../../utils';
import makeAsyncActionCreator from './makeAsyncActionCreator'
import makeSyncActionCreator from './makeSyncActionCreator'
import makeReducer from './makeReducer'

export default function makeActionsReducers(obj){
	const actions= {};
	const reducers = {};
	Object.keys(obj).forEach(name=>{
		const type = camelCaseToCapitals(name);
		const action = obj[name];
		const {meta,reducer,async} = action;
		if(reducer){
			if(async){
				if(typeof reducer == 'function'){
					reducers[`${name}_SUCCESS`] = reducer
				}else{
					Object.keys(reducer).forEach(n=>
						(reducers[`${name}_${n}`] = reducer[n])
					);
				}
				if(!reducers[`${name}_ERROR`]){reducers[`${name}_ERROR`] = defaultErrorCatcherReducer}
			}else{
				reducers[name] = reducer;
			}
		}
		actions[name] = (async)?
			makeAsyncActionCreator(type,async,meta) :
			makeSyncActionCreator(type,meta)
		;
	});
	return [actions,makeReducer(reducers)];
}

function defaultErrorCatcherReducer(state,meta,err){
	throw err;
	return state;
}