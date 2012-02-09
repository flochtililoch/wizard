$$.register(function(){

	$('#step2 form').ajaxForm({
		success: Wizard.formSuccess
	});

});