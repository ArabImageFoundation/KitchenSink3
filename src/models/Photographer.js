import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Studio from './Studio';
import Photo from './Photo';
import Person from './Person';

export default Person.extend(
    'Photographer'
,   [
		'nationality'
    ,   {
            name:'date_birth'
        ,   label:'birth date'
        ,   type:'date'
        }
    ,   {
            name:'date_death'
        ,   label:'date of death'
        ,   type:'date'
        }
    ,	{
    		name:'studio'
    	,	type:Studio
    	}
    ,	'source'
    ]
);