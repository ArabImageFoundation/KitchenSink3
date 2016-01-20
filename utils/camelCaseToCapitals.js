export default function camelCaseToConst(name){
	return name.replace(/([A-Z])/g,letter=>`_${letter}`).toUpperCase();
}