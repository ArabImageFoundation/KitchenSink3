export default function isObject(val){
	return val && val.constructor && val.constructor === Object
}