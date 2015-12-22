import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Contract from './Contract';

export default makeModel(
    'Collection'
,   [
        'name'
    ,   'reference'
    ,   'donor'
    ,   'acquisition'
    ,   Contract
    ]
);