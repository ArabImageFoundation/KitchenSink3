function getInputProps(spec){

    var {name,label,help,type} = spec;

    
    const id = `${this.getTypeName()}[${this.props.index}][${name}]`;

    return {
        label:{
            htmlFor:id
        }
    ,   input:{
            onChange:this.onChange(name)
        ,   onBlur:this.onBlur(name)
        ,   onFocus:this.onFocus(name)
        ,   value:this.getValueFor(name)
        ,   type:(type && (typeof type == 'string')) ? type : 'text'
        ,   id
        }
    ,   title:label || name
    ,   errors:this.getErrorsFor(name)
    ,   isValid:this.getIsValidFor(name)
    ,   focused:(this.state.focused == name)
    ,   help
    }
}