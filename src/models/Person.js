import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Studio from './Studio';
import Photo from './Photo';
import Location from './Location'
export default makeModel(
    'Person'
,   [
        {
            name:'name'
        ,   type:'text'
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
            name:'telephone'
        ,   type:'tel'
        }
    ]
);