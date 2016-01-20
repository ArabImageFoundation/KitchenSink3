import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import File from './File';
import Photographer from './Photographer';
import Studio from './Studio';
import Location from './Location';

export default makeModel(
    'Photo'
,   [
        'reference'
    ,   'title'
    ,   'subject'
    ,   'tags'
    ,   {
            name:'published'
        ,   type:'checkbox'
        }
    ,   'genre'
    ,   'condition'
    ,   'support'
    ,   'process'
    ,   'tone'
    ,   {
            name:'width'
        ,   type:'number'
        }
    ,   {
            name:'height'
        ,   type:'number'
        }
    ,   'ratio'
    ,   {
            name:'inscriptions'
        ,   type:'textarea'
        }
    ,   {
            name:'remarks'
        ,   type:'textarea'
        }
    ,   {
            name:'date'
        ,   label:'date'
        ,   type:'date'
        }
    ,   {
            name:'recto'
        ,   type:File
        }
    ,   {
            name:'verso'
        ,   type:File
        }
    ,   {
            name:'Photographer'
        ,   type:Photographer
        ,   options:{
                max:1
            ,   allowCreate:false
            ,   allowRemove:true
            ,   invert:true
            }
        }
    ,   {
            name:'Studio'
        ,   type:Studio
        ,   options:{
                max:1
            ,   allowCreate:false
            ,   allowRemove:true
            ,   invert:true
            }
        }
    ,   {
            name:'location'
        ,   type:Location
        ,   options:{
                max:1
            ,   allowCreate:true
            ,   allowRemove:false
            ,   allowLoad:false
            }
        }
    ,   {
            name:'borderWidth'
        ,   label:'border width'
        ,   type:'number'
        }
    ,   {
            name:'borderHeight'
        ,   label:'border height'
        ,   type:'number'
        }
    ,   {
            name:'mountWidth'
        ,   label:'Mount/Frame width'
        ,   type:'number'
        }
    ,   {
            name:'mountHeight'
        ,   label:'Mount/Frame height'
        ,   type:'number'
        }
    ]
,   function renderSummary(){
        const images = this.getRelatedItemsFor('recto');
        const reference = this.props.value.reference;
        var preview = []
        if(images && images.length){
            preview.push(<File index={images[0]} view='Summary' key='preview'/>);
        }else{
            preview.push(<span key='preview'>(no files}</span>);
        }
        if(!reference){
            preview.push(<span key='reference' className='reference'>(no reference)</span>)
        }
        else{
            preview.push(<span key='reference' className='reference'>{reference}</span>)
        }
        return <div>{preview}</div>
    }
);