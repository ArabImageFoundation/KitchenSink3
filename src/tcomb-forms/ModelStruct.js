import React from 'react';
import t from 'tcomb-form';
import templateEdit from './templates/edit';
import templateSearch from './templates/search';
import templateLoad from './templates/load';
import templateSummary from './templates/summary';
import templateFull from './templates/full';
import getFormComponent from './getFormComponent';
import {
    humanize
,   merge
,   getTypeInfo
,   getOptionsOfEnum
,   move
,   UIDGenerator
} from 'tcomb-form/lib/util'

const noobj = {};

function deepMerge(A:Object,B:Object){
    if(t.Nil.is(A)){return Object.assign({},B);}
    if(t.Nil.is(B)){return Object.assign({},A);}
    const C = Object.assign({},A);
    Object.keys(B).forEach(function(key){
        const val = B[key];
        if(!(key in C) || !t.Object.is(val)){
            C[key] = val;
            return;
        }
        C[key] = deepMerge(C[key],val);
    })
    return C;
}

class ModelStruct extends t.form.Component{

    static transformer = {
        format: value => t.Nil.is(value) ? noobj : value,
        parse: value => value
    }

    constructor(props,state){
        super(props,state);
        const {value,saved} = props;
        const hasItem = !!value;
        this.state = {
            hasError: false
        ,   value:this.getTransformer().format(value)
        ,   valid:hasItem
        ,   saved:saved
        };
        this.bindMe(['save','load','search'])
    }

    getId() {
        const attrs = this.props.options.attrs || noobj
        if (attrs.id) {
            return attrs.id
        }
        if(!this.uid){
            const uidGenerator = this.getUIDGenerator();
            this.uid = uidGenerator.next()
        }
        return this.uid
    }

    getUIDGenerator(){
        this.uidGenerator = this.uidGenerator || this.props.ctx.uidGenerator || new UIDGenerator(this._reactInternalInstance ? this._reactInternalInstance._rootNodeID : '')
        return this.uidGenerator
    }

    componentWillReceiveProps(props){
        const {value,saved} = props
        if(value){
            this.setState({value,saved})
        }
    }

    bindMe(bindables){
        bindables.forEach(key=>{
            this[key] = this[key].bind(this);
        })
    }

    load(evt){
        if(!this.props.actions.load){
            throw new Error('no load action defined')
        }
        evt && evt.preventDefault();
        const parentPath = this.props.options.parentPath;
        const index = this.props.options.index;
        this.props.actions.load(index,parentPath)
    }

    search(value){

    }

    getSummary(){
        const {value} = this.state;
        if(value.name){return value.name;}
        return 'no name';
    }


    save(evt){
        if(!this.props.actions.save){throw new Error('no save function defined');}
        evt && evt.preventDefault();
        const value = this.getValue();
        if(value){
            this.props.actions.save(this.props.options.index,value);
        }
    }

    isValueNully() {
        return Object.keys(this.refs).every((ref) => this.refs[ref].isValueNully())
    }

    removeErrors() {
        this.setState({ hasError: false })
        Object.keys(this.refs).forEach((ref) => this.refs[ref].removeErrors())
    }

    getValue() {
        const value = {}
        const props = this.getTypeProps()
        for (const ref in props) {
            if (this.refs.hasOwnProperty(ref)) {
                value[ref] = this.refs[ref].getValue()
            }
        }
        return this.getTransformer().parse(value)
    }

    isOptional(ref,value){
        const relations = this.constructor.options.relations;
        if(!relations){return false;}
        return (
            (ref in relations) &&
            relations[ref].optional &&
            t.Nil.is(value)
        );
    }

    validate(currentValue){
        currentValue = currentValue || this.state.value;
        const {ctx} = this.props
        let value = {}
        let errors = []
        let hasError = false
        let result

        if (this.typeInfo.isMaybe && this.isValueNully()) {
            this.removeErrors()
            return new t.ValidationResult({errors: [], value: null})
        }

        const props = this.getTypeProps()
        for (const ref in props) {
            if (props.hasOwnProperty(ref)) {
                const validationOptions = {
                    context:ctx.context
                ,   path:ctx.path.concat(ref)
                }
                if(!this.isOptional(ref,currentValue[ref])){
                    result = t.validate(currentValue[ref],props[ref],validationOptions)
                    errors = errors.concat(result.errors)
                    value[ref] = result.value
                }else{
                    value[ref] = currentValue[ref] || [];
                }
            }
        }

        if (errors.length === 0) {
            const InnerType = this.typeInfo.innerType
            value = new InnerType(value)
            if (this.typeInfo.isSubtype && errors.length === 0) {
                result = t.validate(value, this.props.type, this.getValidationOptions())
                hasError = !result.isValid()
                errors = errors.concat(result.errors)
            }
        }

        this.setState({ hasError: hasError })
        return new t.ValidationResult({errors, value})
    }

    onChange(fieldName, fieldValue, path, kind) {
        const value = t.mixin({}, this.state.value)
        value[fieldName] = fieldValue
        const validationResult = this.validate(value);
        const valid = (validationResult.errors.length<1)
        this.removeErrors();
        this.setState({value,valid}, () => {
            this.props.onChange && this.props.onChange(value, path, kind)
        })
    }

    getTemplates() {
        return merge(
            t.form.Form.templates
        ,   this.props.ctx.templates
        ,   this.props.options.templates)
    }

    getTemplate(options) {
        options = options || this.props.options;
        if(this.props.options.template){
            return this.props.options.template;
        }
        const view = this.getView(options);
        if(view=='edit'){
            return templateEdit;
        }
        if(view=='search'){
             return templateSearch;
        }
        if(view=='load'){
            return templateLoad;
        }
        if(view=='summary'){
            return templateSummary;
        }
        if(view=='full'){
            return templateFull;
        }
        throw new Error('no template')
    }

    getTypeProps() {
        return this.typeInfo.innerType.meta.props
    }

    getOrder(options){
        return this.props.options.order || Object.keys(this.getTypeProps())
    }

    getInputs(options){
        const { ctx } = this.props
        const props = this.getTypeProps()
        const auto = this.getAuto()
        const i18n = this.getI18n()
        const config = this.getConfig()
        const templates = this.getTemplates()
        const value = this.state.value
        const inputs = {}
        const typeName = this.constructor.displayName;
        const index = this.props.index;
        const len = ctx.path.length;
        const isNested = (len > 0);
        if(len>0 && props.someVar){
            for(const props in props){
                if(props.hasOwnProperty(prop)){
                    const propType = prop[prop];
                    const propOptions = options.fields && options.fields[prop] ? options.fields[prop] : noobj
                    const Comp = getFormComponent(propType,propOptions);
                }
            }
        }

        for (const prop in props) {
            if (props.hasOwnProperty(prop)) {
                const propType = props[prop]
                const propOptions = options.fields && options.fields[prop] ? options.fields[prop] : noobj
                inputs[prop] = React.createElement(getFormComponent(propType, propOptions), {
                    key: prop,
                    ref: prop,
                    type: propType,
                    options: propOptions,
                    value: value[prop],
                    onChange: this.onChange.bind(this, prop),
                    ctx: {
                        context: ctx.context,
                        uidGenerator: this.getUIDGenerator(),
                        auto,
                        config,
                        name: ctx.name ? `${ctx.name}[${prop}]` : prop,
                        label: humanize(prop),
                        i18n,
                        templates,
                        path: ctx.path.concat(prop)
                    }
                })
            }
        }
        return inputs
    }

    getView(options){
        return options.view || 'edit';
    }

    getStatus(){
        const saved = this.state.saved;
        const valid = this.state.valid;
        return {saved,valid};
    }

    getMethods(){
        const methods = {
            save:this.save
        ,   load:this.load
        ,   search:this.search
        ,   summary:this.summary
        }
        return methods;
    }

    getSearchResults(){

    }

    getOptions(){
        return (deepMerge(
            this.constructor.options
        ,   this.props.options
        ) || {});
    }

    getLocals() {
        const options = this.getOptions();
        const locals = super.getLocals()
        locals.view = this.getView(options);
        locals.order = this.getOrder()
        if(locals.view == 'edit'){
            locals.inputs = this.getInputs(options)
        }
        locals.summary = this.getSummary();
        locals.className = options.className
        locals.methods = this.getMethods();
        locals.status = this.getStatus();
        locals.options = options;
        return locals
    }

    render(){
        const locals = this.getLocals();
        const template = this.getTemplate(locals.options)
        return template(locals)
    }

}

export default ModelStruct;
