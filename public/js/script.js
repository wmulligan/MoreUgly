window.onload = function() {
	var input = ace.edit("input-editor");
	input.setTheme("ace/theme/twilight");
	var JavaScriptMode = require("ace/mode/javascript").Mode;
	input.getSession().setMode(new JavaScriptMode());
	
	var ast = ace.edit("ast-editor");
	ast.setTheme("ace/theme/twilight");
	ast.getSession().setMode(new JavaScriptMode());
	
	ast.setShowPrintMargin(false);
	input.setShowPrintMargin(false);
	
	$('.ace_gutter').css({'background-color': '#2F3837', 'color': '#C5C7B6'});
	
	$('#parse').click(function() {
		$.ajax({
			type: 'POST',
			url: '/',
			data: {input: input.getSession().getValue()},
			success: function(data) {
				ast.getSession().setValue(data.output);
			},
			dataType: 'json'
		});
	});
	
};
