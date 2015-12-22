import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';

export default makeModel(
    'Studio'
,   [
        {
            name:'name'
        ,   type:'text'
        }
    ,   {
            name:'address'
        ,   type:'text'
        }
    ,   {
            name:'telephone'
        ,   type:'tel'
        }
    ]
);