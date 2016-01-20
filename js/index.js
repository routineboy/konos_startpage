var current_dapp = "none";
var workstation_array;
var current_workstation = 0;

//ajax succes function scope is limitied to its
//own namespace. This function takes the workstation array
//variable and globalizes it so the entire javascript file
//can use it
function globalize_array(array) {
	workstation_array = array;
}

//get an array containing all dapps within each workstation
//does not include "mobile" and "main_style" folders
//just the "workstation_x" folders
function retrieve_workstation_dapps() {
	$.ajax({
		type:"POST",
		url:"php/get_dapps.php",
		success: function(workstation_array) {
			//clean the ajax output
			workstation_array = workstation_array.replace(/"/g, "");
			workstation_array = workstation_array.split("]");

			for (i = 0; i < workstation_array.length; i++) {
				//clean the ajax output
				workstation_array[i] = workstation_array[i].replace("[.,..,", "");
				workstation_array[i] = workstation_array[i].replace("[.,..", "");
				//turn it into an array
				workstation_array[i] = workstation_array[i].split(",");
			}

			workstation_array.splice(workstation_array.length - 1, 1);
			globalize_array(workstation_array);
		}

	});
}

//build the workstation
function initiate_startpage() {
	var window_height = window.innerHeight;
	for (i = 0; i < workstation_array.length; i++) {
		$("body").append("<div class='container_" + i + "'></div>");
		$(".container_" + i).css("position", "absolute");
		$(".container_" + i).css("height", "100%");
		$(".container_" + i).css("width", "100%");
		$(".container_" + i).css("top", String(window_height*i) + "px");

		for (x = 0; x < workstation_array[i].length; x++) {
			if (workstation_array[i][x] != "") {
				$("head").append("<link rel='stylesheet' href='dapps/workstation_" + i + "/" + workstation_array[i][x] + "/main.css' type='text/css'/>");
				$(".container_" + i).append("<div class='" + workstation_array[i][x] + "'></div>");
				$.getScript("../dapps/workstation_" + i + "/" + workstation_array[i][x] + "/main.js");
			}
		}
	}
		
	/*if a dapp is clicked set it as the current dapp*/
	$("body > *").click(function() {
		var container = $(this).attr("class");
		$("." + container + " > *").click(function() {
			current_dapp = $(this).attr("class");
		});
	});

	$("body").scrollTop("0px");

	//this is a variable that maps all the keys pressed
	var keys = {};

	$("body").on("keydown", function(e) {
		keys[e.which] = true;

		if (keys[18] && keys[49]) { //ALT+1
			$("body").scrollTop(0);
			current_workstation = 0;
			current_dapp = "none";

		} else if (keys[18] && keys[50]) { //ALT+2
			$("body").scrollTop(window_height);
			current_workstation = 1;
			current_dapp = "none";

		} else if (keys[18] && keys[51]) { //ALT+3
			$("body").scrollTop(window_height + window_height);
			current_workstation = 2;
			current_dapp = "none";

		}
	});

	$("body").on("keyup", function(e) {
		delete keys[e.which];
	});

}

$(document).ready(function() {
	retrieve_workstation_dapps();
	
	//wait for ajax to retrieve all the dapps
	var wait = setInterval(function() {
		if (workstation_array) {
			initiate_startpage(workstation_array);
			clearInterval(wait);
		} 
	}, 1);

});
