import {assign} from '../../../utils'
import makeBoundDispatch from './makeBoundDispatch';

export default function makeAsyncActionCreator(type,fn,metaDefault={}){
	return function AsyncActionCreator(_meta){
		const meta = assign(metaDefault,_meta)
		return (dispatch,getState) => {
			const disp = makeBoundDispatch(dispatch,type)
			disp('START',{meta});
			const promise = fn(meta,{dispatch,getState,disp});
			if(!promise.then){
				return promise;
			}
			return promise.then(payload=>disp('SUCCESS',{payload,meta}))
				.catch(error=>{disp('ERROR',{error:true,payload:{error,message:error.message},meta})})
		}
	}
}