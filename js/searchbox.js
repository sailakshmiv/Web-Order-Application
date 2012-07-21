function initializeSearchbox()
{
	$("body").append("<div id=\"search\" class=\"form\" style=\"background-color: #ffffff; position: absolute; top: 10%; left: 10%; margin: 0px; height: auto; border-color: #000000; border-width: 1px; border-style: solid; z-index:101;\"><span id=\"prompt\"></span> <input id=\"query\" type=\"text\" width=800px/><br/><div class=\"searchresult\" id=\"closeresult\">No results found.</div><ol id=\"results\"></ol><button id=\"close\" style=\"display: none\">Close</button></div>");
	$("#search").hide();
}

function closeSearchbox(closeCallback)
{
	$('#search').fadeOut("slow");
	
	//Unbind events so there's no confusion on subsequent searchbox openings
	$('#query').unbind("keyup");
	$('#closeresult').unbind("click");
	$('#close').unbind("click");
	
	//return the id key of our result
	closeCallback($("#search").data("key"));	
}

function openSearchbox(prompt, keypressCallback, closeCallback)
{
	//The key data field of the search div will be used to store the id of the selected search result, so let's initialize it.
	$("#search").data("key", -1);

	//set the prompt message for this search
	$('#prompt').html(prompt);

	$('#search').fadeIn("slow");

	$('#query').keyup(function()
	{
		var query = $("#query").val();
		
		if (query !== "")
		{
			keypressCallback();
		}
		else
		{
			clearSearchboxResults();
		}
	});

	$('#closeresult').click(function()
	{
		//We're going to be setting the key data field of the searchbox to pass the selected element out
		$("#search").data("key", -1);
		
		//Simulate a close
		$("#close").click();
	});	

	$('#close').click(function()
	{
		closeSearchbox(closeCallback);
	});	
}

function clearSearchboxResults()
{
	//remove the internal html of the results element
	$("#results").empty();
	
	$("#results").off("click", ".searchresult");
	
	//show the default result (the termination result)
	$("#closeresult").show();
}

function addSearchboxResult(result, key)
{
	//hide the default result (the termination result)
	$("#closeresult").hide();

	$("#results").append("<li data-key=\"" + key + "\" class=\"searchresult\">" + result + "</li>");
	
	$("#results").children().last().data("key", key);
	
	//We're appending an element to the list, so let's get the last child and register an event
	$("#results").children().last().on("click", function(event)
	{
		//We're going to be setting the key data field of the searchbox to pass the selected element out
		var id = $(event.target).data("key");

		$("#search").data("key", id);
				
		//Simulate a close
		$("#close").click();
	});
}

function getSearchboxQuery()
{
	return $("#query").val();
}
