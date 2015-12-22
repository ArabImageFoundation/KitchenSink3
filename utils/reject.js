export default function reject(val){
	return new Promise(function(resolve,reject){return reject(new Error(val))});
}