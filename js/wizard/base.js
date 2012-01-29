// WIZARD HANDLER
function Wizard(options){
	
	var defaults = {
		effectDuration: 200
	};
	
	// merge default options & user options
	var o =  jQuery.extend(defaults, options);
	
	// check if given step exists
	this.isValidStep = function(step){
		return $.inArray(step, o.steps ) > -1 ? true : false;
	};
	
	// save current step data in browser history
	this.save = function(step, url, content, title){
		if(!this.isValidStep(step)){
			return false;
		}

		var data = {
			context: {},
			title: title,
			newContent: {},
			saved: true
		};
		
		$('.updatable').each(function(){
			data.newContent[this.id] = $(content).find('#' + this.id)[0].outerHTML;
		});

		History.pushState(data, step, url);
		return data;
	};
	
	// load new step
	this.load = function(step, data){
		if(!this.isValidStep(step)){
			return false;
		}
		
		var currentStep = $('.updatable:not(.disabled):last');
		var nextStep = currentStep.siblings('#' + step);
		if(nextStep.length)
		{
			// Replace contextual elements
			$('title')[0].innerHTML = data.title;
			$(o.currentStepSelector).removeClass('enabled', o.effectDuration).siblings('.' + step).addClass('enabled', o.effectDuration);

			// Hide current step
			currentStep.addClass('folded', o.effectDuration);

			// Show next step
			var nextSteps = $('#' + nextStep[0].id + ' ~ .box:not(.disabled)');
			nextSteps.addClass('disabled');
			var newContent = $(data.newContent[nextStep[0].id]);
			$$.preloadImages(newContent, function(){
				newContent.addClass('folded');
				nextStep.replaceWith(newContent);
				newContent.removeClass('folded', o.effectDuration);
			});
		}
	};
};

// HISTORY HANDLER
(function(window,undefined){

	// Prepare
	var History = window.History;
	if(!History.enabled){
		// History.js is disabled for this browser.
		return false;
	}

	// Bind to StateChange Event
	History.Adapter.bind(window,'statechange',function(){
		var State = History.getState();
		console.log(State, window.location);
		myWizard.load(State.title, State.data);
	});

})(window);

var myWizard = new Wizard({
	steps: ['step1', 'step2', 'step3', 'step4'],
	currentStepSelector: 'ol.steps li.enabled'
});

myWizard.formSuccess = function(response, status, xhr, form){

	// Evaluate new scripts
	var scriptsRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var existingScripts = ($('head').html() + $('body').html()).match(scriptsRegex);
	var newScripts = $.grep(response.match(scriptsRegex), function(n, i){
			return ($.inArray(n, existingScripts) !== -1);
	}, true);
	$('body').append($(newScripts.join('')));
	
	// Save new step into history
	var nextStep = form.attr('action').match(/(.*).html/)[1];
	var data = myWizard.save(nextStep, form.attr('action'), response, response.match(/<title>(.*?)<\/title>/)[1]);
	
	// Then run registered actions
	$$.launch();
};