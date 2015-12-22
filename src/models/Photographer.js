import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Studio from './Studio';
import Photo from './Photo';

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