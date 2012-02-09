// WIZARD HANDLER
var Wizard = (function($, History){
  
  var
    self = {},
    defaults = { effectDuration: 200 },
    o = {};
  
  // check if given step exists
  function isValidStep(step){
    return $.inArray(step, o.steps ) > -1 ? true : false;
  };
  
  self.configure = function(options)
  {
    // merge default options & user options
    o =  jQuery.extend(defaults, options);
    return this;
  }
  
  // save current step data in browser history
  self.save = function(step, url, content, title){
    if(!isValidStep(step)){
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
  self.load = function(step, data){
    if(!isValidStep(step)){
      return false;
    }
    
    var currentStep = $('.updatable:not(.disabled):last');
    var nextStep = currentStep.siblings('#' + step);
    if(nextStep.length)
    {
      // Replace contextual elements
      $('title')[0].innerHTML = data.title;
      $('h1')[0].innerHTML = data.title;
      $('ol.steps li.enabled').removeClass('enabled', o.effectDuration).siblings('.' + step).addClass('enabled', o.effectDuration);

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

  return self;
}(jQuery, History));

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
    Wizard.load(State.title, State.data);
  });

})(window);

Wizard
  .configure({steps: ['step1', 'step2', 'step3', 'step4']})
  .formSuccess = function(response, status, xhr, form){
    // Evaluate new scripts
    var scriptsRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var existingScripts = ($('head').html() + $('body').html()).match(scriptsRegex);
    var newScripts = $.grep(response.match(scriptsRegex), function(n, i){
        return ($.inArray(n, existingScripts) !== -1);
    }, true);
    $('body').append($(newScripts.join('')));
  
    // Save new step into history
    var nextStep = form.attr('action').match(/(.*).html/)[1];
    var data = Wizard.save(nextStep, form.attr('action'), response, response.match(/<title>(.*?)<\/title>/)[1]);

    // Then run registered actions
    $$.launch();
  };