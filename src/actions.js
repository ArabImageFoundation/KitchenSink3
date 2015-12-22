import * as models from './models';
import Immutable from 'immutable'
import {resolve,reject,assign} from '../utils';

function matchesKey(key, event) {
    const charCode = event.keyCode || event.which;
    const char = String.fromCharCode(charCode);
    return key.name.toUpperCase() === char.toUpperCase() &&
    key.alt === event.altKey &&
    key.ctrl === event.ctrlKey &&
    key.meta === event.metaKey &&
    key.shift === event.shiftKey;
}

const keys = {
    'up':'up'
,   'down':'down'
,   'left':'left'
,   'right':'right'
,   'cancel':'escape'
,   'confirm':'enter'
}

function currentKey(key,evt){
    for(key in keys){
        if(matchesKey(keys[key], evt)){
            return key;
        }
    }
    return null;
}

export default {
    asyncAction:{
        meta:{} //gets merged with meta provided from the user
    ,    async(meta,{disp,dispatch,getState}){
            /**
                `disp('suffix',props)` is equivalent to `dispatch('ASYNC_ACTION_suffix',props);`
                return promise, or use `reject(value)` or `resolve(value)`
            **/
        }
    ,    reducer(state,meta,payload){
            /** must return state **/
        }
    }
,   onKeyDown:{
        evt:{}
    ,   async({evt},{dispatch,getState}){
            const state = getState();
            const behavior = currentKey(key, evt);
            if(!behavior){return resolve};
            if(state.get('columns').size){
                if(behavior == 'cancel' || behavior == 'confirm'){
                    dispatch({type:'removeColumn'});
                }
            }
        }
    }
,   detailedAsyncAction:{
        async(meta,{disp}){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    disp('PROCESSING',meta);
                    setTimeout(()=>
                        meta.pleaseGiveMeAnError ? reject(new Error('Oh noes!')) : resolve({message:'ok!'})
                    ,1000)
                },1000)
            })
        }
    ,    reducer:{
            start:(state,meta,payload)=>assign(state,{status:'started...'})
        ,    processing:(state,meta,payload)=>assign(state,{status:'processing...'})
        ,    error(state,meta,err){
                return assign(state,{status:'ERROR',message:err.message});
            }
        ,    success:(state,meta,{message})=>assign(state,{status:'done',message})
        }
    }
,    resetState:{
        reducer:()=>initialState
    }
,    normalAction:{
        meta:{}
    }
,   createItem:{
        meta:{
            type:''
        ,   parentPath:[]
        }
    ,   reducer(state,{type,parentPath}){
            var parents;
            if(parentPath){
                const [type,index] = parentPath;
                parents = Immutable.Map({'parents':Immutable.List([index])});
            }else{
                parents = Immutable.Map();
            }
            var index;
            const stateWithNewItem = state.updateIn([type],function(collection){
                index = collection.size;
                const item = Immutable.Map({
                    index
                ,   saved:false
                ,   relations:Immutable.Map()
                ,   value:Immutable.Map()
                ,   errors:Immutable.Map()
                ,   valids:Immutable.Map()
                ,   hasErrors:false
                ,   parents
                })
                return collection.push(item);
            })
            if(!parentPath){return stateWithNewItem;}
            return stateWithNewItem.updateIn(parentPath,Immutable.List(),(relation)=>relation.push(index));
        }
    }
,   add:{
        meta:{
            index:''
        ,   type:''
        ,   parentPath:[]
        }
    ,   reducer(state,{index,type,parentPath}){
            return state.updateIn(parentPath,Immutable.List(),relation=>relation.push(index))
                .updateIn([type,index,'parents',parentPath[0]],Immutable.List(),relation=>relation.push(parentPath[1]))
        }
    }
,   remove:{
        meta:{
            index:''
        ,   type:''
        ,   parentPath:[]
        }
    ,   reducer(state,{index,type,parentPath}){
            return state.updateIn(parentPath,relation=>relation.filterNot(idx=>idx==index))
                .updateIn([type,index,'parents',parentPath[0]],relation=>relation.filterNot(idx=>idx==parentPath[1]))
        }
    }
,   validate:{
        async({validator,path,value},{disp}){
            if(!validator){
                return resolve(value);
            }
            return validator(value)
                .catch(errors=>{
                    disp('HAS_ERRORS',{error:true,payload:{errors},meta:{path}})
                    throw new Error(errors.join(','))
                })
        }
    ,   reducer:{
            hasErrors(state,{path},{errors}){

                const [type,index,propName] = path;

                return state
                    .setIn([type,index,'errors',propName],Immutable.List(errors))
                    .setIn([type,index,'valids',propName],false)
                    .setIn([type,index,'hasErrors'],true)
            }
        ,   success(state,{path}){
                const [type,index,propName] = path;
                return state
                    .deleteIn([type,index,'errors',propName])
                    .setIn([type,index,'valids',propName],true)
                    .setIn([type,index,'hasErrors'],false)
            }
        }
    }
,   onChange:{
        meta:{
            path:[]
        ,   value:[]
        }
    ,   reducer(state,{path,value}){
            const [type,index,propName] = path;
            const val = {[propName]:value};
            return state.updateIn([type,index],function(item){
                return item.merge({
                    value:item.get('value').merge(val)
                ,   saved:false
                ,   errors:item.get('errors').deleteIn([propName])
                ,   valids:item.get('valids').set(propName,false)
                })
            })
        }
    }
,    addColumn:{
        reducer:(state,props)=>{
            const column = Immutable.fromJS({props});
            return state.updateIn(
                ['columns'],columns =>columns.push(column)
            )
       }
    }
,    save:{
        meta:{
            type:''
        ,   index:''
        ,   value:''
        }
    ,    reducer:(state,{index,type,value})=>{
            const item = Immutable.fromJS({index,type,saved:true,value});
            return state.mergeIn(
                [type,index]
            ,   item
            )
        }
    }
,    removeColumn:{
        reducer:(state)=>state.updateIn(['columns'],columns=>columns.pop())
    }
,    addItem:{
        meta:{}
    ,    reducer(state,{parentIndex,childIndex,parentProp,index}){
            const object = state.columns[index].object;
            const columns = (typeof childIndex !== 'undefined') ?
                state.columns
                    .slice(0,state.columns.length-1)
                    .map((column,id)=>
                        id==parentIndex?
                            merge(column,{
                                object:merge(
                                    column.object
                                ,    {
                                        [parentProp]:column.object[parentProp].map((obj,i)=>i==childIndex?object:obj)
                                    }
                                )
                            }) :
                        column
                ) :
                state.columns
                    .slice(0,state.columns.length-1)
                    .map((column,id)=>
                        id==parentIndex?
                            merge(column,{
                                object:merge(
                                    column.object
                                ,    {
                                        [parentProp]:[...column.object[parentProp],object]
                                    }
                                )
                            }) :
                        column
                )
            return {columns};
        }
    }
,    modifyColumn:{
        reducer(state,meta){
            return assign(state,{
                columns:state.columns.map((column,i)=>
                    i==meta.index?
                        merge(column,{object:merge(column.object,meta)}) :
                        column
                )
            })
        }
    }
}

function create(type){
    if(type=='Collection'){
        return {
            reference:''
        ,    name:''
        ,    donor:''
        ,    acquisition:''
        ,    content:''
        ,    contracts:[]
        ,    photos:[]
        ,    albums:[]
        ,    objects:[]
        }
    }
    if(type=='Contract'){
        return {
            reference:''
        ,    status:''
        ,    type:''
        ,    researcher:''
        ,    remarks:''
        }
    }
    if(type=='Photo'){
        return {
            title:''
        ,    subject:''
        ,    photographer:''
        ,    studio:''
        ,    date:''
        ,    country:''
        ,    city:''
        }
    }
    if(type=='Photographer'){
        return {
            name:''
        ,    nationality:''
        ,    studio:''
        ,    address:''
        ,    telephone:''
        ,    birthdate:''
        ,    deathdate:''
        ,    biography:''
        ,    source:''
        }
    }
    if(type=='Studio'){
        return {
            name:''
        ,    address:''
        ,    telephone:''
        ,    biography:''
        ,    source:''
        }
    }
    if(type=='Album'){
        return {
            reference:''
        ,    photos:[]
        }
    }
    if(type=='Object'){
        return {
            reference:''
        ,    photos:[]
        }
    }
}
