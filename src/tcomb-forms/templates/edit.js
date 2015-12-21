import React from 'react';

export default function edit(locals) {

    let children = [
        locals.help && (<div>locals.help</div>)
    ,     locals.error && locals.hasError && (<div>locals.error</div>)
    ,     ...locals.order.map(name => locals.inputs[name])
    ]

    const len = locals.path.length;
    const {disabled} = locals;
    const {valid,saved} = locals.status;

    const className = [
        'fieldset'
    ,     `fieldset-depth-${len}`
    ,     (len > 0) && `fieldset-${locals.path.join('-')}`
    ,     locals.className
    ];



    const fieldset = (<fieldset
            className={className}
            disabled={disabled}
        >
        <legend>{locals.label}</legend>
        <div>saved:{saved?'yes':'no'}</div>
        <div>valid:{valid?'yes':'no'}</div>
        {children}
    </fieldset>);

    if(len>0){
        return fieldset;
    }


    return (<form onSubmit={locals.methods.save}>
        {fieldset}
        <input type='submit' value='ok' disabled={!valid}/>
    </form>)

}

