import isObject from './isObject';
import isArray from './isArray';
import copyObject from './copyObject';
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
export default function copy(val,recursion,opts){
	if(recursion==0){return val;}
	if(isArray(val)){
		return copyArray(val, recursion, opts);
	}
	if(isObject(val)){
		return copyObject(val, recursion, opts);
	}
	return obj;
}
copy.SKIP_EMPTY = SKIP_EMPTY
copy.SKIP_UNDEFINED = SKIP_UNDEFINED