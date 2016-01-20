import React,{Component} from 'react';
import cx from 'classnames';
import {IconCheck,IconError,MessageHelp,MessageError} from '../UI'

function isNil(val){return val==null;}

function getDef(val,def){
    if(isNil(val)){return def;}
    return val;
}

class Model extends Component{
    constructor(props,context){
        super(props,context);
        this.onChangeTimeout = null;
        this.state = {
            focused:null
        }
    }
    setOnChangeTimeout(name,path,time=300){
        if(!path){throw new Error('no path defined for validate')}
        clearTimeout(this.onChangeTimeout);
        const that = this;
        this.onChangeTimeout = setTimeout(function(){
            that.validateField(name,path);
        },time)
    }
    validateField(name,path){
        const validate = this.props.actions.validate;
        const value = this.props.value[name];
        const validator = this.getValidator().key(name);
        validate(path,value,validator);        
    }
    setOnChangeTimeoutFor(name,path){
        return this.setOnChangeTimeout(name,path);
    }
    onFocus(name){
        var that = this;
        return function(){
            that.setState({focused:name});
        }
    }
    onBlur(name){
        var that = this;
        return function(){
            const path = that.getPath(name);
            that.setState({focused:null});
            that.validateField(name,path)
        }
    }
    onChange(name){
        const that = this;
        const actions = this.props.actions;
        const path = this.getPath(name);
        return function(evt,val){
            const value = val || evt.target.value;
            actions.onChange(path,value);
            that.setOnChangeTimeoutFor(name,path);
        }
    }
    onCheckboxChange(name){
        const that = this;
        const actions = this.props.actions;
        const path = this.getPath(name);
        return function(evt,val){
            const value = evt.target.checked;
            actions.onChange(path,value);
            that.setOnChangeTimeoutFor(name,path);
        }
    }
    getValidator(){
        return this.constructor.validator;
    }
    getSpec(){
        return this.constructor.spec;
    }
    getTypeName(){
        return this.constructor.type;
    }
    getPath(suffix){
        const index = this.props.index;
        const type = this.getTypeName()
        return !suffix ? [type,index] : [type,index,suffix];
    }
    getValueFor(name){
        return this.props.value && this.props.value[name]
    }
    getErrorsFor(name){
        return this.props.errors && this.props.errors[name];
    }
    getIsValidFor(name){
        return this.props.valids && this.props.valids[name];
    }
    getRelatedItemsFor(name){
        return this.props.relations[name];
    }
    getRelationProps(spec){
        var {name,label,help,type,options} = spec;
        if(this[`getRelationProps_${name}`]){
            return this[`getRelationProps_${name}`](spec);
        }
        const include = this.getRelatedItemsFor(name) || [];
        const Comp = type;
        options = options || {};
        const parentPath = this.getPath().concat(['relations',name]);
        const max = getDef(options.max,Infinity);
        const maxReached = include.length >= max;
        const allowLoad = maxReached ? false : getDef(options.allowLoad,true);
        const allowCreate = maxReached? false : getDef(options.allowCreate,true);
        const allowRemove = getDef(options.allowRemove,true);
        return {
        	include
        ,	Comp
        ,	parentPath
        ,   allowLoad
        ,   allowCreate
        ,   allowRemove
        };
    }
    renderRelation(name,props,key){
        if(this[`renderRelation_${name}`]){
            return this[`renderRelation_${name}`](props,key);
        }
        const {Comp,include,parentPath,allowCreate,allowLoad,allowRemove} = props;
        const managerProps = {
        	include
        ,	mode:'List'
        ,	childrenView:'Form'
        ,	parentPath
        ,   allowLoad
        ,   allowCreate
        ,   allowRemove
        }
        return (<div key={key}>
            <label>{name}</label>
            <Comp.Manager {...managerProps}/>
        </div>)
    }
    getInputPropsType_checkbox(spec){
        var {name,label,help} = spec;
        const type = 'checkbox';
        label = getDef(label,name);
        const focused = this.state.focused == name;
        const id = `${this.getTypeName()}[${this.props.index}][${name}]`;

        const labelProps = {
            htmlFor:id
        }
        const inputProps = {
            onChange:this.onCheckboxChange(name)
        ,   onBlur:this.onBlur(name)
        ,   onFocus:this.onFocus(name)
        ,   checked:this.getValueFor(name)
        ,   type
        ,   id
        }
        return {
            label:labelProps
        ,   input:inputProps
        ,   title:label
        ,   errors:this.getErrorsFor(name)
        ,   isValid:this.getIsValidFor(name)
        ,   focused
        ,   help
        }
    }
    getInputProps(spec){
        var {name,label,help,type} = spec;
        if(this[`getInputProps_${name}`]){
            return this[`getInputProps_${name}`](spec)
        }
        if(this[`getInputPropsType_${type}`]){
            return this[`getInputPropsType_${type}`](spec)
        }
        type = getDef(type,'text');
        label = getDef(label,name);
        const focused = this.state.focused == name;
        const id = `${this.getTypeName()}[${this.props.index}][${name}]`;

        const labelProps = {
            htmlFor:id
        }
        const inputProps = {
            onChange:this.onChange(name)
        ,   onBlur:this.onBlur(name)
        ,   onFocus:this.onFocus(name)
        ,   value:this.getValueFor(name)
        ,   type
        ,   id
        }
        return {
            label:labelProps
        ,   input:inputProps
        ,   title:label
        ,   errors:this.getErrorsFor(name)
        ,   isValid:this.getIsValidFor(name)
        ,   focused
        ,   help
        }
    }
    renderInputType_textarea(name,props,key){
        const className = cx(
            'input-control'
        ,   {
                focused:props.focused
        ,       hasErrors:props.errors && props.errors.length
            }
        )

        return (
            <div key={key} className={className}>
                <label {...props.label}>{props.title}</label>
                <div className='input-field'>
                    <textarea {...props.input} rows={5} cols={10}/>
                    {props.isValid && <IconCheck/>}
                    <i className='material-icons keyboard_return'>keyboard_return</i>
                </div>
                <div className='input-info'>
                    {props.errors && props.errors.map((err,index)=><MessageError key={index} text={err.replace('$key$',props.title)}/>)}
                    {props.help && <MessageHelp text={props.help}/>}
                </div>
            </div>
        )

    }
    renderInputType_checkbox(name,props,key){
        console.log(props.input)
        const className = cx(
            'input-control input-control-checkbox'
        ,   {
                focused:props.focused
            ,   checked:props.input.checked
            }
        )

        return (
            <div key={key} className={className}>
                <div className='input-field input-field-checkbox'>
                    <input {...props.input}/>
                </div>
                <label {...props.label} tabIndex={0}>{props.title}</label>
                <div className='input-info'>
                    {props.errors && props.errors.map((err,index)=><MessageError key={index} text={err.replace('$key$',props.title)}/>)}
                    {props.help && <MessageHelp text={props.help}/>}
                </div>
            </div>
        )       
    }
    renderInput(name,props,key,type){
        if(this[`renderInput_${name}`]){
            return this[`renderInput_${name}`](props,key)
        }
        if(this[`renderInputType_${type}`]){
            return this[`renderInputType_${type}`](name,props,key);
        }


        const className = cx(
            'input-control'
        ,   {
                focused:props.focused
        ,       hasErrors:props.errors && props.errors.length
            }
        )

        return (
            <div key={key} className={className}>
                <label {...props.label}>{props.title}</label>
                <div className='input-field'>
                    <input {...props.input}/>
                    {props.isValid && <IconCheck/>}
                </div>
                <div className='input-info'>
                    {props.errors && props.errors.map((err,index)=><MessageError key={index} text={err.replace('$key$',props.title)}/>)}
                    {props.help && <MessageHelp text={props.help}/>}
                </div>
            </div>
        )
    }
    renderInputs(){
        const inputs = this.getSpec();
        return inputs.map((spec,key)=>{
            const {name,type} = spec;
            if(typeof type == 'function'){
                const props = this.getRelationProps(spec);
                return this.renderRelation(name,props,key)
            }
            const props = this.getInputProps(spec);
            return this.renderInput(name,props,key,type);
        })
    }
    getFieldProps(spec){
        var {name,label,type} = spec;
        if(this[`getFieldProps_${name}`]){
            return this[`getFieldProps_${name}`](spec)
        }
        label = getDef(label,name);
        return {
            label
        ,   value:this.getValueFor(name)
        }
    }
    renderField(name,props,key){
        if(this[`renderField_${name}`]){
            return this[`renderField_${name}`](props,key)
        }
        return (
            <div key={key}>
                <span>{props.value}</span>
            </div>
        )
    }
    renderFields(){
        const inputs = this.getSpec();
        return inputs.map((spec,key)=>{
            const {name} = spec;
            const props = this.getFieldProps(spec)
            return this.renderField(name,props,key)
        })
    }
    getView(){
        return this.props.view || 'Summary';
    }
    summary(){
        if(this.getSummary){return this.getSummary();}
        const inputs = this.getSpec();
        const main = inputs[0];
        const propName = main.name;
        return (this.getValueFor(propName) || `empty \`${this.getTypeName()}\``);
    }
    getClassName(view){
        const typeName = this.getTypeName();
        return cx(
            'Model'
        ,   `Model${typeName}`
        ,   `view-${view}`
        )
    }
    renderSummary(){
        const _summary = this.summary();
        const hasErrors = this.props.hasErrors;
        const className = this.getClassName('Summary');
        return (<div className={className}>
                {_summary}
                {hasErrors && <IconError/>}
        </div>)
    }
    renderForm(){
        const inputs = this.renderInputs();
        const className = this.getClassName('Form');
        return (<div className={className}>
            {inputs}
            <button onClick={this.props.actions.removeColumn}>ok</button>
        </div>)
    }
    renderFull(){
        const fields = this.renderFields();
        const className = this.getClassName('Full');
        return (<div className={className}>
            {fields}
        </div>)
    }
    render(){
        const view = this.getView();
        const renderFunction = `render${view}`;
        if(!this[renderFunction]){throw new Error(`there is no ${renderFunction} function defined on ${this.getTypeName()}`);}
        return this[renderFunction]();
    }
}

export default Model