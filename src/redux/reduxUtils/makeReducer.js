import {camelCaseToCapitals,assign} from '../../../utils';

export default function createReducer(handlers){
	const keys = {};
	Object.keys(handlers).forEach(name=>{
		keys[camelCaseToCapitals(name)] = name;
	});
	return function reducer(state,action){
		if(!(action.type in keys)){return state;}
		const fnName = keys[action.type];
		const fn = handlers[keys[action.type]];
		const {meta,payload} = action
		return fn(state,meta,payload);
	}
}
