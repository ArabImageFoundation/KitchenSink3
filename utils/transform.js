import {SKIP} from './consts';

/**
 * transform - returns a new object from a given object, applying a functor on
 * every element.
 * The functor has the following signature:
 * function(value,key,object,SKIP,index)
 * and is expected to return a value. If you return `SKIP`, the value is skipped.
 * 
 *
 *
 * @param  Object   obj       The object to operate on
 * @param  Function fn        The functor to apply
 * @param  any      [thisArg] A context for the functor
 * @return Object             A new object made of the values returned from the functor
 */
export default function transform(obj,fn,thisArg){
	if(!obj){return {}}
	const newObj = {}
	Object.keys(obj).forEach(function(key,i){
		const val = obj[key];
		const res = fn.call(thisArg,val,key,obj,SKIP,i);
		if(res == SKIP){return;}
		newObj[key] = res;
	});
	return newObj;
}
transform.SKIP = SKIP;
