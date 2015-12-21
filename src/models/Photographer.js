import {t} from './Model';
import React from 'react';
import Model from './Model';
import Studio from './Studio'


export default Model('Photographer',{
    schema:{
        name:t.String
    ,   nationality:t.maybe(t.String)
    ,   studio:Studio
    }
,   options:{
        relations:{
            studio:['hasOne',true]
        }
    }
})
