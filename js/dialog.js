function initializeDialog()
{
	$("body").append("<div id=\"dialog\" class=\"form\" style=\"background-color: #ffffff; position: absolute; top: 30%; left: 20%; margin: 0px; height: auto; width: 60%; border-color: #000000; border-width: 1px; border-style: solid; z-index:101; text-align: center;\"><span id=\"prompt\"></span><div style=\"width: 40%; margin-left: auto; margin-right: auto;\"><div id=\"yes\" class=\"button\" style=\"float: left\">Yes</div><div id=\"no\" class=\"button\" style=\"float: right\">No</div></div></div>");
	$("#dialog").hide();
}


function openDialog(prompt, yesCallback, noCallback)
{
	//set the prompt message for this dialog
	$("#dialog > #prompt").html(prompt);
	
	$("#dialog > div > #yes").click(function()
	{
		$("#dialog").hide("slow");
		yesCallback();
	});

	$("#dialog > div > #no").click(function()
	{
		$("#dialog").hide("slow");
		noCallback();
	});

	
	$("#dialog").show("slow");
}

