import React from 'react';

export default function summary(locals) {

    return (<a onClick={locals.methods.load}>
        {locals.summary}
    </a>)


}

