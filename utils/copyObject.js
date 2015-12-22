import isObject from './isObject';
import isArray from './isArray';
import copyArray from './copyArray';
import {SKIP_UNDEFINED,SKIP_EMPTY} from './consts';

/**
 * copies recursively arrays and objects
 * options include:
 * - SKIP_EMPTY: to skip empty arrays and objects
 * - SKIP_UNDEFINED: to skip undefined values
 * 
 * @param  {any}
 * @param  {int} maximum recursion (defaults to infinity)
 * @param  {int} 0, or a combination of SKIP_EMPTY and SKIP_UNDEFINED
 * @return {any}
 */
export default function copyObject(obj,recursion,opts){
	if(recursion==0){return obj;}
	const skipUndefined = opts & SKIP_UNDEFINED;
	const skipEmpty = opts & SKIP_EMPTY;
	const newObj = []
	var hasKeys = false;
	recursion--;
	Object.keys(obj).forEach(function(key,i){
		var val = obj[key];
		if(isObject(val)){
			val = copyObject(val,recursion,opts);
		}
		if(isArray(obj)){
			val = copyArray(val, recursion,opts);
		}
		if(val!==null || !skipUndefined){
			newObj[key] = val;
			hasKeys = true;
		}
	})
	return ((hasKeys || !skipEmpty) && newObj);
}

copyObject.SKIP_UNDEFINED = SKIP_UNDEFINED;
copyObject.SKIP_EMPTY = SKIP_EMPTY;