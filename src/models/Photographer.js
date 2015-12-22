import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Studio from './Studio';

export default makeModel(
    'Photographer'
,   [
        {
            name:'name'
        ,   type:'text'
        ,   validate:Validator.String
        }
    ,	{
    		name:'studio'
    	,	type:Studio
    	}
    ,   {
            name:'address'
        ,   type:'text'
        }
    ]
);