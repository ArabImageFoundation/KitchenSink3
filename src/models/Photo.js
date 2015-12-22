import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import File from './File';
import Photographer from './Photographer';

export default makeModel(
    'Photo'
,   [
        'reference'
    ,   {
            name:'Photographer'
        ,   type:Photographer
        ,   options:{
                max:1
            ,   allowCreate:false
            ,   invert:true
            }
        }
    ,   {
            name:'recto'
        ,   type:File
        }
    ,   {
            name:'verso'
        ,   type:File
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
            preview.push(<span key='reference'>(no reference)</span>)
        }
        else{
            preview.push(<span key='reference'>{reference}</span>)
        }
        return <div>{preview}</div>
    }
);