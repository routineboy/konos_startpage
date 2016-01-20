/*variable declartions for global vars
to be used in the main function*/
var cursor_left_m = 25;
var cursor_top_m = -3;
var height = 4;
var command_num = 0;

function adjust_right() {
	/*get the new command ID width*/
	var length_command = document.getElementById("command" + command_num);
	length_command.style.fontSize = 15;
	length_command = (length_command.clientWidth + 1);

	/*adjust_all() the cursors left margin according to the new command width*/
	cursor_left_m = length_command - 7;
	$(".blinking_cursor").css("margin-left", cursor_left_m.toString() + "px");
}

function adjust_all() {
	/*change the unique number in the ID for a new command*/
	command_num++;

	/*go 15 pixels lower to avoid writing over top previous command*/
	height = height + 15;

	/*see if we are overflowing with commands*/
	if (height + 16 > $(".terminal_0").height()) {
		$(".terminal_0 > *").remove();
		$("#command0").remove();
		cursor_left_m = 20;
		cursor_top_m = -3;
		height = 4;
		command_num = 0;		

		/*append the new ID to the body of the page with new command ID and new height*/
		$(".terminal_0").append("<p id='command" + command_num + "' style='margin-top:  " + height.toString() + "px'>\xa0>>&nbsp</p>");
		$("#command" + command_num).addClass("command_style");		

		$(".terminal_0").append("<span class='blinking_cursor'>|</span>");
		$(".blinking_cursor").css("margin-top", cursor_top_m.toString() + "px");
		$(".blinking_cursor").css("margin-left", cursor_left_m.toString() + "px");

	} else {		
		/*append the new ID to the body of the page with new command ID and new height*/
		$(".terminal_0").append("<p id='command" + command_num + "' style='margin-top:  " + height.toString() + "px'>\xa0>>&nbsp</p>");
		$("#command" + command_num).addClass("command_style");

		/*change the top margin of the cursor to the same level as new command*/
		cursor_top_m = cursor_top_m + 15;

		/*Move the cursor to the new position*/
		$(".blinking_cursor").css("margin-top", cursor_top_m.toString() + "px");
	}
}

/*Get the clipboard content and paste it the terminal dapp*/
document.addEventListener("paste", function(event) {
	var data = event.clipboardData, content, logEntry;

	if (data.types[0] == "text/plain") {
		content = data.getData(data.types[0]);
	} else {
		content = data.types[0];
	}

	$("#command" + command_num.toString()).append(content);
	adjust_right();

	$("#contenteditable").remove();
});

$(document).on("keydown", function(e) {
    /*if you press backspace*/
    if (e.which == 8) {
		/*prevent backspace from going back to previous page*/
        e.preventDefault();
		
        /*remove last character when backspace is pressed*/
		$("#command" + command_num.toString()).text(function (_,txt) {
			/*get the width of the command*/
			var length_command = document.getElementById("command" + command_num.toString());
			length_command.style.fontSize = 15;
			length_command = (length_command.clientWidth + 1);

			if (length_command <= 35) {
				/*do nothing */
			} else {
				return txt.slice(0, -1);
			}
		});

		adjust_right();
	}
});

function download_song(song_url, playlist) {
	$.ajax({
		type:"POST",
		url:"dapps/workstation_0/terminal_0/exec_commands.php",	
		data:{"command" : "download_song:" + song_url + ":" + playlist},
		success: function(data) {
			console.log(data);
		}
	});
}

$(document).ready(function() {
	var map = [];
	var pasting = false;

	/*add contenteditable attribute to temp div so that we can initiate the paste event in firfox*/
	onkeydown = onkeyup = function(e) {
		e = e || event;
		map[e.keyCode] = e.type == "keydown";

		if (map[17] && map[86]) {
			pasting = true;
			$("body").append("<div id='contenteditable' contenteditable></div>");
			contenteditable = document.getElementById("contenteditable");
			contenteditable.setAttribute("contenteditable", "");

			setTimeout(function() {
				pasting = false;
			}, 100)
		}
	}

	//Start by building the dapp

	/*create an ID with a unique number that is used to store commands*/
	$(".terminal_0").append("<p id='command" + command_num + "' style='margin-top:  " + height.toString() + "px'>\xa0>>&nbsp</p>");
	$("#command" + command_num).addClass("command_style");
	
	/*create the blinking cursor*/
	$(".terminal_0").append("<span id='cursor' class='blinking_cursor'>|</span>");
	$(".blinking_cursor").css("margin-top", cursor_top_m.toString() + "px");
	$(".blinking_cursor").css("margin-left", cursor_left_m.toString() + "px");	

	$("body").keypress(function(key) {
		if (current_dapp == "terminal_0") {
			if (key.which == 13) {
				var command = $("#command" + command_num.toString()).text();
				command = command.replace("\xa0>>\xa0", "");
				command = command.replace("\r", "");

				adjust_all();
				adjust_right();

				if (command == "clear") {
					$(".terminal_0 > *").remove();
					$("#command0").remove();
					
					cursor_left_m = 20;
					cursor_top_m = -3;
					height = 4;
					command_num = 0;

					$(".terminal_0").append("<p id='command" + command_num + "' style='margin-top:  " + height.toString() + "px'>\xa0>>&nbsp</p>");
					$("#command" + command_num).addClass("command_style");
					$("#command" + command_num).css("white-space", "nowrap");

					/*create the blinking cursor*/
					$(".terminal_0").append("<span class='blinking_cursor'>|</span>");
					$(".blinking_cursor").css("margin-top", cursor_top_m.toString() + "px");
					$(".blinking_cursor").css("margin-left", cursor_left_m.toString() + "px");					
				} else if (command.indexOf("download") >= 0) {
					command = command.split("-");
					command_flag_0 = command[1];
					command_flag_0 = command_flag_0.split("\xa0");

					if (command_flag_0[0] == "s") {
						command_flag_1 = command[2];
						command_flag_1 = command_flag_1.split("\xa0");

						if (command_flag_1[0] == "p") {
							song_url = command_flag_0[1];
							playlist = command_flag_1[1];
							download_song(song_url, playlist);
						} else {
							console.log("Invalid flag for song download: -" + command_flag_1[0]);
						}

					} else if (command_flag_0[0] == "i") {
						console.log("no implentation yet");
					} else {
						console.log("invalid flag: -" + command_flag_0[0]);
					}

				}

			} else if (key.which == 32) {
				key.preventDefault();
				$("#command" + command_num.toString()).remove("blinking_cursor");
				$("#command" + command_num.toString()).append("\xa0");
				key = "\xa0";

				adjust_right();
			} else if (pasting) {
				//dont do anything;
			} else {		
				key = String.fromCharCode(key.keyCode || key.charCode);
				$("#command" + command_num.toString()).append(key);
				adjust_right();
			}
		}
	});

});