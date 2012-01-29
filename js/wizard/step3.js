$$.register(function(){

	$('#step3 form').ajaxForm({
		success: myWizard.formSuccess
	});

})