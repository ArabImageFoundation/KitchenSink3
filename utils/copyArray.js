import isObject from './isObject';
import isArray from './isArray';
import copyObject from './copyObject';
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
export default function copyArray(arr,recursion,opts){
	if(recursion==0){return arr;}
	const skipUndefined = opts & SKIP_UNDEFINED;
	const skipEmpty = opts & SKIP_EMPTY;
	const newArr = []
	recursion--;
	arr.forEach(function(obj,i){
		if(isObject(obj)){
			obj = copyObject(obj,recursion,opts);
		}
		if(isArray(obj)){
			obj = copyArray(obj, recursion,opts);
		}
		if(obj!==null || !skipUndefined){
			newArr.push(obj);
		}
	})
	return ((newArr.length || !skipEmpty) && newArr)
}

copyArray.SKIP_UNDEFINED = SKIP_UNDEFINED;
copyArray.SKIP_EMPTY = SKIP_EMPTY;