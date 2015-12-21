import React from 'react';

export default function full(locals) {

    const value = locals.value;
    const len = locals.path.length;
    const children = [];

    for(key in value){
        var val = value[key];
        if(val.constructor && val.constructor == Object){
            val = full({value:val});
        }
        children.push((<li>
            <span>{key}: </span>
            <span>{val}</span>
        </li>))
    }

    const titleRank = 'h'+(len>=3?4:len+1);
    const title = React.createElement(titleRank,locals.label);

    return (<div>
        {title}
        {children}
    </div>);
}

