import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Image,{ImageUploadField,UploadField} from '../Fields/Image'

export default makeModel(
    'File'
,   [
        {
            name:'name'
        ,   type:'text'
        }
    ,   {
            name:'files'
        ,   type:'file'
        }
    ]
,   function renderSummary(){
        const value = this.props.value;
        const name = value.name;
        var summary;
        if(value.files && value.files.length){
            summary =  value.files.slice(0,3).map(file=><Image key={file.name} file={file} width={50} height={50}/>)
        }else if(value.name){
            summary = value.name;
        }else{
            summary = 'empty file'
        }
        const hasErrors = this.props.hasErrors;
        const className = this.getClassName('Summary');
        return (<div className={className}>
                {summary}
                <span>{name}</span>
                {hasErrors && <IconError/>}
        </div>)
    }
,   function renderInputType_file(name,props,key){
        const uploadFieldProps = Object.assign({},props,{
            label:props.title
        ,   imageWidth:50
        ,   imageHeight:50
        ,   multiple:true
        ,   onChange:(files)=>{
                files = files ? Array.prototype.slice.apply(files) : null;
                props.input.onChange(null,files);
            }
        ,   files:props.input.value
        })
        return (<div style={{clear:'both',width:'100%'}} key={key}><ImageUploadField {...uploadFieldProps}/></div>)
    }
);