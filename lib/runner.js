var exec = require('child_process').exec;


function runner(command, timeout){
	function toPromise(resolve){
		function cb(err, stdout, stderr){
			var result = {
				stdOutput: stdout,
				stdError:  stderr,
				error:     err
			};
			resolve(result);
		}

		exec(command, {timeout: timeout}, cb);
	}

	return new Promise(toPromise);
}

module.exports = runner;