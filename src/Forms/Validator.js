function replaceKey(key){
	return function replaceInText(text){
		return text.replace('$key$',key)
	}
}

export default function Validator(checks){


	function validate(key,value,callback){

		var i = 0;
		var callbackCalled = false;
		const errors = [];
		const validations = validate.checks

		function done(errs){
			if(!callbackCalled){
				if(errs && errs.length){error.concat(errs);}
				if(!errors.length){
					callback(null,value);
				}else{
					callback(errors.map(replaceKey(key)),value);
				}
			}
			callbackCalled = true;
		}

		function next(err){
			if(err){
				errors.push(err);
			}
			const validator = validations[i++];
			if(!validator){
				return done();		
			}
			validator(value,next,done);
		}

		next();

	}

	function extend(newChecks){
		return Validator(validate.checks.concat(newChecks));
	}

	validate.checks = checks;
	validate.extend = extend;
	return validate;
}