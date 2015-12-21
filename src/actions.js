import * as models from './models';
import Immutable from 'immutable'
import {resolve,reject,assign} from '../utils';

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
,    detailedAsyncAction:{
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
,    addColumn:{
        meta:{
            type:''
        ,   view:''
        ,   name:''
        }
    ,    reducer:(state,{type,name,view,value,index})=>{
            const hasIndex = (typeof index!== 'undefined')
            if(!hasIndex){
                index = state.get(type).size;
            }
            const hasParent = state.get('columns').size>0;
            const columnProps = Immutable.fromJS({
                type
            ,   view
            ,   index
            ,   name
            ,   relations:{}
            })
            const stateColumnsUpdated = state.updateIn(
                ['columns']
            ,   (columns)=>columns.push(columnProps)
            );
            if(!hasIndex){
                 const stateWithNewObject = stateColumnsUpdated.updateIn(
                    [type]
                ,   (collection)=>collection.push(
                        Immutable.fromJS({
                            type
                        ,   saved:false
                        ,   value:{}
                        ,   index
                        })
                    )
                 );
                 if(hasParent){
                     const columns = state.get('columns')
                     const previousColumn = columns.last();
                     const parentIndex = previousColumn.get('index');
                     const parentType = previousColumn.get('type')
                     const parentKey = name;
                     return stateWithNewObject.updateIn(
                         [parentType,parentIndex,'relations',parentKey]
                    ,   Immutable.List()
                    ,   relations=>relations.push([type,index])
                    )
                 }
                 return stateWithNewObject;
            }else{
                return stateColumnsUpdated;
            }
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
