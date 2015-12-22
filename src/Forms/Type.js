import React,{Component} from 'react';
import Validator from './Validator';
import Struct from './Struct';
import Input from './Input';

const defTemplates = {
	string:Input
,	struct:Struct
}

function getTemplate(name,templates){
	if(!templates || (!name in templates)){
		if(!name in defTemplates){throw new Error('could not find a template for '+name);}
		return defTemplates[name];
	}
	return templates[name];
}

export default function Type(typeName:String,validator:Validator,findTemplate){

	findTemplate = findTemplate || getTemplate;

	function type(name){

		function validate(value,callback){
			return validator(name,value,callback);
		}

		function render(value,options,templates){
			const template = findTemplate(typeName,templates);
			return React.createElement(template,{value,options,meta,templates})
		}

		const meta = {
			name
		,	validate
		, 	render
		}

		return meta;
	}
	type.type = typeName;
	return type;

}

export const text = Type(
	'string'
,	Validator([
		function isString(value){
			if(!(typeof value == 'string')){return '$key$ is not a string'}
		}
	])
);	

export const struct = function(name,fields){
	const items = [];
	const validator = Validator(
		fields.map(function(type){
			const name = type.name;
			items.push(type);
			return function validateField(value,next){
				type.validate(value[name],next);
			}
		})
	);
	return Object.assign(Type('struct',validator)(name),{items})
}