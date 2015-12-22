/**
 * Returns a function that takes a single argument and runs
 * all functions one by one, passing each function the result
 * of the previous function.
 * This is similar to `wrap`, but re-uses the result of the previous function
 * 
 * @param  {...functions}
 * @return {function}
 */
export default function compose(...fns){
	return function composed(arg){
		const context = this;
		fns.forEach(function(fn){
			arg = fn.call(context,arg);
		})
		return arg;
	}
}