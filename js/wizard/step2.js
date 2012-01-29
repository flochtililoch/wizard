$$.register(function(){

	$('#step2 form').ajaxForm({
		success: myWizard.formSuccess
	});

})