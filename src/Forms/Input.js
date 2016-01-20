import React, {Component} from 'react';

function isNil(obj){
	return obj==null;
}

function merge(A:Object,B:Object){
    if(isNil(A)){return Object.assign({},B);}
    if(isNil(B)){return Object.assign({},A);}
    const C = Object.assign({},A);
    Object.keys(B).forEach(function(key){
        const val = B[key];
        if(!(key in C) || !t.Object.is(val)){
            C[key] = val;
            return;
        }
        C[key] = merge(C[key],val);
    })
    return C;
}

class Input extends Component{
	static template(locals){
		return (<span>
			<label></label>
			<input value={locals.value} onChange={locals.onChange}/>
		</span>)
	}
	constructor(props,context){
		super(props,context);
		this.onChange = this.onChange.bind(this);
		this.state = this.getNewStateFromProps(props,{}) || {};
	}
	mergeOptions(options){
		if(options!==this.__options){
			this.__options = options;
		}
		return merge(this.constructor.options,props.options);
	}
	getNewStateFromProps({value,options},state){
		const newState = {};
		var changed = false;
		if(!isNil(value) && value !== state.value){
			newState.value == value;
			changed = true;
		}
		if(!isNil(options) && options !== state.passedOptions){
			newState.options = this.mergeOptions(options);
			newState.passedOptions = options;
			changed = true;
		}
		if(!changed){return;}
		return newState;
	}
	componentWillReceiveProps(props){
		const newState = this.getNewStateFromProps(props,this.state)
		if(newState){
			this.setState(newState);
		}
	}
	onChange(evt){
		return 
	}
	buildLocals(){
		const {value,options} = this.state;
		const {errors} = this.props;
		const onChange = this.onChange;
		return {
			value
		,	options
		, 	errors
		, 	onChange
		}
	}
	render(){
		const locals = this.buildLocals();
		return this.constructor.template(locals);
	}
}

export default Input;