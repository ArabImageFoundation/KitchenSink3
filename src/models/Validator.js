
function toPromise(_validate){
	return function validate(key,value,callback){
		if(!callback){
			return new Promise(function(resolve,reject){
				_validate(key,value,function(errs,value){
					if(errs){
						return reject(errs);
					}
					return resolve(value);
				})
			})
		}
		return _validate(key, value, callback);
	}
}

function makeDone(callback,value){

	var callbackCalled = false;

	return function done(errs){
        if(!callbackCalled){
            if(!errs){
                callback(null,value);
            }else{
                callback(errs,value);
            }
        }
        callbackCalled = true;
    }	
}

function ObjectValidator(spec){

	if(!spec.constructor || !spec.constructor==Object){
		throw new Error('invalid spec given to object validator');
	}

	const arr = Object.keys(spec)

	const validateKey = toPromise(function _validateKey(key,value,callback){
        if(spec[key]){
            return spec[key].validate(key,value,callback);
        }else{
        	return callback(null,value);
        }
    });

    function keyValidator(key){
    	if(!spec[key] || !spec[key].validate){return null;}
    	return function (value,callback){
    		return validateKey(key, value, callback);
    	}
    }

    const validate = toPromise(function _validate(key,value,callback){

        var i = 0;
        var hasErrors = false;
        var specItem;
        const errors = {};

        const done = makeDone(callback,value);
  

        function next(errs){
            if(errs){
                errors[specItem.name] = errs;
                hasErrors = true;
            }
            key = arr[i++];
            if(!specItem){
                return done(hasErrors && errors);
            }
            validateKey(key,value[key],next);
        }
    });

    function extend(newSpec){
    	return ObjectValidator(Object.assign(spec,newSpec));
    }

    validate.checks = spec;
    validate.extend = extend;
    validate.key = keyValidator;
    return validate;

}

function ArrayValidator(...checks){

	const validator = Validator(...checks)

	const validate = toPromise(function _validate(key,value,callback){

		const {length} = value;
		var i = 0;

		const done = makeDone(callback,value);

		if(!length){return done();}

		function next(err){
			if(err){
				return done(err)
			}
			if(i>=length){
				return done();		
			}
			const item = value[i++];
			validator(i,item,next);
		}

		next();
	})

	function extend(...newChecks){
		return ArrayValidator(validate.checks.concat(newChecks));
	}

	validate.extend = extend;
}

export default function Validator(...checks){

	const validate = toPromise(function _validate(key,value,callback){

		var i = 0;
		
		const errors = [];
		const validations = checks;

		const done = makeDone(callback,value);

		function next(err){
			if(err){
				errors.push(err);
			}
			const validator = validations[i++];
			if(!validator){
				return done(errors.length && errors);		
			}
			validator(value,next,done);
		}

		next();
	})

	function extend(...newChecks){
		return Validator(validate.checks.concat(newChecks));
	}

	function isRequired(message){
		return Validator([required(message),...validate.checks])
	}

	validate.isRequired = isRequired;
	validate.checks = checks;
	validate.extend = extend;
	return validate;
}

function required(message='field cannot be empty'){
	return function(key,valye,callback){	
		if(val==null){
			return next(message);
		}
		next();
	}
}

Validator.Object = ObjectValidator;
Validator.Array = ArrayValidator;

Validator.String = Validator(
	function(value,next){
		if(typeof value!=='string'){
		    return next('$key$ is not a string')
		}
		return next();
	}
)