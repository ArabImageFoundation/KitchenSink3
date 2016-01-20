export default function is(Ctor,val){
	if(arguments.length<2){return is.bind(this,Ctor);}
	return val != null && val.constructor === Ctor || val instanceof Ctor;
}