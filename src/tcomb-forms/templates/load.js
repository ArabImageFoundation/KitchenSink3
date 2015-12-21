import React from 'react';

export default function edit(locals) {

    let children = [
        locals.help && (<div>locals.help</div>)
    ,     locals.error && locals.hasError && (<div>locals.error</div>)
    ,     ...locals.order.map(name => locals.inputs[name])
    ]

    const len = locals.path.length;

    const className = [
        'fieldset'
    ,     `fieldset-depth-${len}`
    ,     (len > 0) && `fieldset-${locals.path.join('-')}`
    ,     locals.className
    ];



    const fieldset = (<fieldset
            className={className}
            disabled={locals.disabled}
        >
        hello world
        <legend>{locals.label}</legend>
        <div>saved:{locals.saved?'yes':'no'}</div>
        <div>valid:{locals.valid?'yes':'no'}</div>
        {children}
    </fieldset>);

    if(len>0){
        return fieldset;
    }

    return (<form onSubmit={locals.methods.prepareSave}>
        {fieldset}
        <input type='submit' value='ok' disabled={locals.disabled}/>
    </form>)

}

