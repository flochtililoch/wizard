$$.register(function(){

	myWizard.save('step1', window.location.href, jQuery('body'), jQuery('title').html());
	
	$('#step1 form').ajaxForm({
		success: myWizard.formSuccess
	});

})