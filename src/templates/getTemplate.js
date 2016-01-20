import File from './File'
import FileImage from './FileImage'
import InputText from './InputText'
import getProps from './getProps';

const templates = {
	render_text:InputText
,	render_date:InputText
,	render_password:InputText
,	render_email:InputText
,	render_url:InputText
,	render_time:InputText
,	render_date:InputText
,	'render_datetime-local':InputText
,	render_tel:InputText
,	render_search:InputText
,	render_file:File
,	render_image:FileImage
,	getProps
}

export default function getTemplate(obj,fnName,spec){

	const {name,type} = spec;

	const typeName = typeof type == 'function' ? type.name : type;

	const attempts = [
		[obj,`${fnName}_${name}`]
	,	[obj,`${fnName}Type_${typeName}`]
	,	[spec,fnName]
	,	[templates,`${fnName}_${typeName}`]
	,	[templates,fnName]
	]

	const {length} = attempts;
	var i = 0;
	while(i<length){
		const [context,method] = attempts[i++];
		if(context[method]){return context[method].bind(obj);}
	}

}