import t from 'tcomb-form'
import ModelStruct from './ModelStruct'
const {
    Textbox
,   List
,   Select
,   Datetime
,   Checkbox
} = t.form;


const SOURCE = 'aifi'

export default function getFormComponent(type, options) {
  if (options.factory) {
    return options.factory
  }
  if (type.getTcombFormFactory) {
    return type.getTcombFormFactory(options)
  }
  const name = t.getTypeName(type)
  switch (type.meta.kind) {
  case 'irreducible' :
    if (type === t.Boolean) {
      return Checkbox // eslint-disable-line no-use-before-define
    } else if (type === t.Date) {
      return Datetime // eslint-disable-line no-use-before-define
    }
    return Textbox // eslint-disable-line no-use-before-define
  case 'struct' :
    return Struct // eslint-disable-line no-use-before-define
  case 'list' :
    return List // eslint-disable-line no-use-before-define
  case 'enums' :
    return Select // eslint-disable-line no-use-before-define
  case 'maybe' :
  case 'subtype' :
    return getFormComponent(type.meta.type, options)
  default :
    t.fail(`[${SOURCE}] unsupported type ${name}`)
  }
}
