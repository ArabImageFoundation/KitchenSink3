/**
 * Returns a function that calls all provided functions one
 * by one and returns the result of the last called function.
 * This is similar to `compose`, but the returned function takes
 * a variable number of arguments, and the same arguments are passed
 * to all wrapped functions.
 * 
 * @param  {...functions}
 * @return {function}
 */
export default function wrap(...fns){
	return function wrapped(...args){
		const context = this;
		fns.forEach(function(fn){
			arg = fn.apply(context,args);
		})
		return arg;
	}
}