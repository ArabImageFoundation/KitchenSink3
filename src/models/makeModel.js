import React,{Component} from 'react';
import {connect} from 'react-redux';
import actions from '../redux/actionsReducer';
import Validator from './Validator';
import Model from './Model';
import ModelManager from './ModelManager';

function isNil(val){return val==null;}

export default function make(name,spec,...methods){

    spec = spec.map(s=>
        (typeof s == 'string') ? {name:s,type:'text'}:
        (typeof s == 'function') ? {name:s.type,type:s} :
        s
    );

    const byName = {};
    spec.forEach(s=>{
        byName[s.name] = s;
    })

    const validator = Validator.Object(byName);

    class _Model extends Model{
        static displayName = name
        static type = name
        static spec = spec
        static validator = validator
    }

    methods.forEach(function(method){
        const name = method.name
        _Model.prototype[name] = method;
    })

    function extend(name,newSpec,...newMethods){
        return make(name,[...spec,...newSpec],...[...methods,...newMethods]);
    }

    function mapDispatchToProps(dispatch){
        return {  
            actions:{
                create(parentPath){
                    return dispatch(actions.createItem({type:name,parentPath}));
                }
            ,   save(index,value){
                    return dispatch(actions.save({index,value,type:name}))
                }
            ,   add(index,parentPath){
                    return dispatch(actions.add({index,parentPath,type:name}));
                }
            ,   remove(index,parentPath){
                    return dispatch(actions.remove({index,parentPath,type:name}));
                }
            ,   validate(path,value,validator){
                    return dispatch(actions.validate({path,value,validator}))
                }
            ,   onChange(path,value){
                    return dispatch(actions.onChange({path,value}))
                }
            ,   removeColumn(){
                    return dispatch(actions.removeColumn())
                }
            ,   view(index,parentPath,view,mode){
                    return dispatch(actions.addColumn({
                        type:name
                    ,   view
                    ,   mode
                    ,   index
                    ,   parentPath
                    }))
                }
            }      
        }
    }

    function getCollection(state){
        return state.get(name);
    }

    function getItem(state,index){
        if(!isNil(index)){
            const item = getCollection(state).get(index).toJS();
            return item;
        }
    }

    const connectedModel = connect(
        function mapStateToProps(state,{index}){
            return getItem(state,index) || {};
        }
    ,   mapDispatchToProps
    )(_Model)

    connectedModel.type = name;

    class _ModelManager extends ModelManager{
        static displayName = `${name}Manager`
        static model = connectedModel
        static type = name
    }

    const connectedModelManager = connect(
        function mapStateToProps(state){
            return {collection:getCollection(state)}
        }
    ,   mapDispatchToProps
    )(_ModelManager);


    connectedModel.Manager = connectedModelManager;
    connectedModel.extend = extend;
    return connectedModel;

}