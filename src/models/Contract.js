import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Photo from './Photo';
import Researcher from './Researcher';

export default makeModel(
    'Contract'
,   [
        'reference'
    ,   'status'
    ,   'type'
    ,   {
            name:'Researcher'
        ,   type:Researcher
        }
    ,   {
            name:'date_arrival'
        ,   label:'date of arrival'
        ,   type:'date'
        }
    ,   {
            name:'date_signature'
        ,   label:'date of signature'
        ,   type:'date'
        }
    ,   {
            name:'date_return'
        ,   label:'date of return'
        ,   type:'date'
        }
    ,   {
            name:'purchase_amount'
        ,   label:'Purchase Amount'
        ,   type:'number'
        }
    ,   {
            name:'copyrights_percentage'
        ,   label:'copyrights percentage'
        ,   type:'number'
        }
    ,   Photo
    ]
);