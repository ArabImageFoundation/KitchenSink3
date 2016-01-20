import getTemplate from './getTemplate'

export default function renderTemplate(obj,spec,key,alternateGetTemplate){

	const getProps = (alternateGetTemplate && alternateGetTemplate(obj,'getProps',spec)) || getTemplate(obj,'getProps',spec)
	const render = (alternateGetTemplate && alternateGetTemplate(obj,'render',spec)) || getTemplate(obj,'render',spec);

	if(!render){
		throw new Error(`could not find a suitable \`render\` template for \`${name}:${type}\``)
	}

	const props = getProps(spec);

	if(!props){return;}

	return render(name,props,key);

}