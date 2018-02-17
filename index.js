var runner = require('./lib/runner');
var Parse  = require('./lib/parseClient');


function runJob(result){
	var job = result.job;

	function saveJob(result){
		var error = result.error;
		var errorCode;
		if(error){
			errorCode = error.killed ? -1 : error.code;
		}
		var params = {
			jobId:     job.id,
			stdOutput: result.stdOutput,
			stdError:  result.stdError,
			errorCode: errorCode
		};
		return Parse.Cloud.run('SaveFinishedJob', params);
	}

	if(job != null){
		var timeout   = job.get('timeout') || job.get('user').get('timeout') || process.env.timeout || 60 * 60 * 10000;
		var algorithm = job.get('algorithm');
		var command   = algorithm.get('bashCommand') + ' ' + job.get('parameters');
		return runner(command, timeout).then(saveJob);
	}
}

Parse.Cloud.run('GetNextJobToRun', {}).then(runJob);