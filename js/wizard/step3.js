$$.register(function(){

	$('#step3 form').ajaxForm({
		success: Wizard.formSuccess
	});

});