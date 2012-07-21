function initializeConfirmation()
{
	$("body").append("<div id=\"confirmation\" class=\"form\" style=\"background-color: #ffffff; position: absolute; top: 30%; left: 20%; margin: 0px; height: auto; width: 60%; border-color: #000000; border-width: 1px; border-style: solid; z-index:101; text-align: center;\"><span id=\"prompt\"></span><div id=\"ok\" class=\"button\" style=\"margin-left: auto; margin-right: auto;\">Dismiss</div></div>");
	$("#confirmation").hide();
}


function openConfirmation(prompt, okCallback)
{
	//set the prompt message for this dialog
	$("#confirmation > #prompt").html(prompt);
	
	$("#confirmation > #ok").click(function()
	{
		$("#confirmation").hide("slow");
		okCallback();
	});
	
	$("#confirmation").show("slow");
}
