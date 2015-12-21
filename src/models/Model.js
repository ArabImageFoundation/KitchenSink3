import React from 'react';
import assign from '../../utils';
import * as Factories from '../tcomb-forms';
import {connect} from 'react-redux';
import t from 'tcomb-form';
import actions from '../redux/actionsReducer';

const Form = t.form.Form;

Form.prototype.removeErrors = function removeErrors(){
    this.refs.input.removeErrors();
}

function merge(A:Object,B:Object){
    if(t.Nil.is(A)){return Object.assign({},B);}
    if(t.Nil.is(B)){return Object.assign({},A);}
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

function attachProps(obj,displayName,type,schema,options){
    obj.displayName = displayName;
    obj.type = type;
    obj.schema = schema
    obj.options = options;
    return obj;
}

function transferMethods(methods,HOC){
    methods.forEach(function(name){
        HOC.prototype[name] = function(){
            return this.getWrappedInstance()[name]();
        }
    })
}

type makeModelArg = {schema:Object,options:?Object,methods:?Object}
export default function makeModel(name:String,{schema,options,methods}:makeModelArg){

    options = Object.assign({},options);
    methods = Object.assign({},methods);

    class Model extends Factories.ModelStruct{}

    const struct = {};
    const fields = Object.assign({},options.fields);
    const relations = {};

    if(options.relations){
        Object.keys(options.relations).forEach(function(key){
            const relation = options.relations[key];
            const [type,args] = relation;
            if(type=='hasOne'){
                relations[key] = {type,optional:args}
            }
        })
    }

    function mapStateToProps(props,{options,value:givenValue}){
        if(t.Nil.is(options.index) && givenValue && givenValue.__index){
            options.index = givenValue.__index;
        }
        const index = options.index;
        if(!t.Nil.is(index)){
            const item = props.get(name).get(index);
            const saved = item.get('saved');
            const value = item.get('value').toJS();
            const relations = item.get('relations');
            if(relations){
                relations.forEach(function(list,key){
                    value[key] = list.map(function(path){
                        const [,index] = path;
                        path = path.concat('value');
                        const child = props.getIn(path).toJS()
                        child.__index = index;
                        return child;
                    }).toJS()
                })
            }
            return {value,saved}
        }
        console.log(givenValue)
        throw new Error('no index')
    }

    function mapDispatchToProps(dispatch){
        return {
            actions:{
                save:(index,value)=>{
                    return dispatch(actions.save({index,value,type:name}))
                }
            ,   load:(index,parentPath)=>{
                    dispatch(actions.addColumn({
                        type:name
                    ,   view:'edit'
                    ,   index
                    ,   name:parentPath
                    }))
                }
            }
        }
    }
    function getTcombFormFactory(){
         return HOC;
    }


    Object.keys(schema).forEach(function(key){
        const obj = schema[key];
        if(typeof obj=='function' && obj.schema){
            if(key in relations){
                struct[key] = t.list(obj.type)
                fields[key] = merge(
                    {
                        item:merge(
                            {
                                view:'summary'
                            ,   parentPath:key
                            }
                        ,   obj.options
                        )
                    }
                ,   fields[key]
                );
            }else{
                struct[key] = obj.type;
                fields[key] = merge(obj.options,fields[key]);
            }
        }else{
            struct[key] = obj;
        }
    })

    const type = t.struct(struct);

    type.getTcombFormFactory = getTcombFormFactory;

    options.fields = fields;
    options.relations = relations;

    attachProps(Model,name,type,schema,options)
    Model.defaultProps = {
        ctx:{
            path:[]
        ,   context:{}
        ,   auto:'labels'
        ,   i18n:t.form.Form.i18n
        }
    ,   type
    ,   options:{}
    }

    Object.keys(methods).forEach(function(key){
        const func:Function = methods[key];
        Model.prototype[key] = func;
    });
    const HOC = connect(mapStateToProps,mapDispatchToProps,false,{withRef:true})(Model);

    transferMethods(['removeErrors','getValue'],HOC)

    attachProps(HOC,name,type,schema,options)

    return HOC;

}

export {t};
