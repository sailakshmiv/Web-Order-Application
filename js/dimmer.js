function initializeDimmer()
{
	$("body").append("<div id='dimmer' style='background-image: url(\"img/shade1x1.png\"); position: fixed; left: 0px; top: 0px; width: 100%; z-index:100;'></div>")
	$("#dimmer").css("height", $(document).height()).hide();
}

function disableDimmer()
{
	$("#dimmer").fadeOut("slow");
}

function enableDimmer()
{
	$("#dimmer").fadeIn("slow");
}