//dapp info
var class_name_music = "music";
var workstation_music = "workstation_0";

//player variable
var audioElement = new Audio();
var playing = false;
var duration;
var current_time;

//scroll variables
var menu_scroll = 0;
var song_scroll = 0;
var browse_scroll = 0;

//GUI vars
var found_songs = [];
var current_playlist;
var playlist_names;
var playlists;

/*These arrays are used to store the current
song index and current playlist index. Instead of 
feeding these values into the music_player function
like i previously did I just extract the last element
of the array. that value being the current index. the 
reason i am doing this is because of some issues
i have been having in the setInterval function that is
within the music_player function. for some reason within
the setInterval function the song_index and playlist_index
variables would reset to 0. that way we wouldn't actually 
go to the next song when we did another music_player function
call with the reset variables*/
var p_index = [];
var s_index = [];

function globalize_array(array) {
	playlists = array;

}

function map_playlists() {
	$.ajax({	
		type:"POST",
		url:"dapps/" + workstation_music + "/" + class_name_music + "/map_playlists.php",
		success: function(playlist_array) {	
			playlist_array = playlist_array.replace(/"/g, "");
			playlist_array = playlist_array.split("]");
			
			for (i = 0; i < playlist_array.length; i++) {
				playlist_array[i] = playlist_array[i].replace("[.,..,", "");
				playlist_array[i] = playlist_array[i].replace("[.,..", "");
				playlist_array[i] = playlist_array[i].split(",");

				for (x = 0; x < playlist_array[i].length; x++) {
					if (playlist_array[i][x] === "img") {
						playlist_array[i].splice(x, 1);
					}
				}

			}

			globalize_array(playlist_array);
		}
	});
}

function main_menu() {
	playlist_names = [];
	$("." + class_name_music).append("<p id='title'>Playlists<p>");

	for (i = 0; i < playlists.length; i++) {
		playlist_name = playlists[i][0].split("--[");

		if (i == 0) {
			$("." + class_name_music).append("<div id='playlist"+ i +"'></div>");
			$("#playlist0").append("<p class='playlist_name'>" + playlist_name[0] + "</p>");
			$("#playlist0").append("<p class='number_of_songs'>" + playlists[0].length + "</p>");

			$("#playlist0").css("position", "relative");
			$("#playlist0").css("height", "25px");
			$("#playlist0").css("width", "500px");
			$("#playlist0").css("background-color", "#B7ADCF");
			playlist_names.push(playlist_name[0]);
		} else if (playlist_name == "") {
			//do nothing
		} else {
			$("." + class_name_music).append("<div id='playlist"+ i +"'></div>");
			$("#playlist" + i).append("<p class='playlist_name'>" + playlist_name[0] + "</p>");
			$("#playlist" + i).append("<p class='number_of_songs'>" + playlists[i].length + "</p>");

			$("#playlist" + i).css("position", "relative");
			$("#playlist" + i).css("margin-top", "10px");
			$("#playlist" + i).css("height", "25px");
			$("#playlist" + i).css("width", "500px");
			playlist_names.push(playlist_name[0]);
		}

	}
}

function playlist_menu(playlist_index) {
	current_playlist = [];

	for (i = 0; i < playlists.length; i++) {
		playlist_name = playlists[i][0].split("--[");

		if (playlist_name[0] == playlist_names[playlist_index]) {
			$("." + class_name_music).append("<p id='title'>" + playlist_name[0] + "</p>");
			current_playlist = playlists[i];
		}
	}

	for (i = 0; i < current_playlist.length; i++) {
		if (i == 0) {
			song = current_playlist[i].split("--[");
			
			song = song[1].replace(".wav", "");
			$("." + class_name_music).append("<p id='song" + i + "'>" + song + "</p>");
			$("#song" + i).css("background-color", "#B7ADCF");
			$("#song" + i).css("text-align", "center");
		} else {
			song = current_playlist[i].replace(".wav", "");
			$("." + class_name_music).append("<p id='song" + i + "'>" + song + "</p>");
			$("#song" + i).css("text-align", "center");
		}
	}

}

//this function creates the song menu that appending the picture, title, progress bar and so on
function song_menu(song, set_attribute) {
	/*so these variables are the values of the last array elments of
	the s_index and p_index variables. Naming them s and p are to make 
	the code easier to read. hopefully*/
	s = s_index[s_index.length - 1];
	p = p_index[p_index.length - 1];

	if (s == 0) {
		song = playlists[p][s]
		song = song.split("--[");
		song = song[1];
	} else {
		song = playlists[p][s];
	}

	if (set_attribute == true) {
		if (s == 0) {
			audioElement.src = "http://50.72.73.61/drive_a/konos/music/" + playlist_names[p] + "/" + song;
		} else {
			audioElement.src = "http://50.72.73.61/drive_a/konos/music/" + playlist_names[p] + "/" + playlists[p][s];
		}
	}

	/*add image to the song_image class*/
	$.ajax({
		type: "POST",
		url: "dapps/" + workstation_music + "/" + class_name_music + "/retr_img.php",
		data: {"song_name" : song + ":" + playlist_names[p]},
		success: function(retr_img) {
			$(".song_image").css("background-image", "url('http://50.72.73.61/drive_a/konos/music/" + playlist_names[p] + "/img/" + retr_img + "')");
		}
	});

	if (song.indexOf(".wav") >= 0) {
		song = song.replace(".wav", "");
	}

	$("." + class_name_music + " >  *").remove();
	$("." + class_name_music).append("<p id='song_title'>" + song + "</p>");

	title_length = $("#song_title").text().length;
	div_length = $("." + class_name_music).width() - 20;

	if (title_length > 40) {
		$("#song_title").css("font-size", "15px");
		$("#song_title").css("top", "7px");
	}

	$("." + class_name_music).append("<div class='song_image' align='center'></div>");	

	/*append neccassary divs and paragraphs*/
	$("." + class_name_music).append("<div class='progress_bar'></div>");
	$(".progress_bar").append("<div class='progress_point'></div>");
	$("." + class_name_music).append("<p id='seconds'></p>");
}

//this function keeps track with the progress bar, buffer, timer, and ofcourse plays the next song
function music_player(song) {

	/*so these variables are the values of the last array elments of
	the s_index and p_index variables. Naming them s and p are to make 
	the code easier to read. hopefully*/
	s = s_index[s_index.length - 1];
	p = p_index[p_index.length - 1];

	audioElement.addEventListener("loadeddata", function() {

		/*get the duration of the song*/
		duration = audioElement.duration;
		duration = Math.round(duration);
		progress_bar_points = $(".progress_bar").width() / duration;

		/*calculate the progress points*/
		$("." + class_name_music).on("click", ".progress_bar", function(e) {
			var posX = $(this).offset().left;
			var clicked_point = Math.round(e.pageX - posX);
			new_position = Math.round(clicked_point / progress_bar_points);

			audioElement.pause();
			audioElement.currentTime = new_position;

			if (Math.round(audioElement.buffered.end(audioElement.buffered.length - 1)) < new_position) {
				var buffer_wait = setInterval(function() {
					if (Math.round(audioElement.buffered.end(audioElement.buffered.length - 1)) > new_position) {

						if (Math.round(audioElement.currentTime) < new_position) {
							audioElement.currentTime = new_position;
							audioElement.play();
						} else {
							audioElement.play();
						}
						
						clearInterval(buffer_wait);

					} 
				}, 100);

			} else {
				if (Math.round(audioElement.currentTime) < new_position) {
					audioElement.currentTime = new_position;
					audioElement.play();
				} else {
					audioElement.play();
				}
			}
		});

		/*create the duration seconds text*/
		if (duration < 10) {	
			duration = "0:0" + duration;
		} else if (duration < 60){
			duration = "0:" + duration
		} else {
			var minutes = Math.floor(duration / 60);
			var seconds = duration - minutes * 60;
			if (seconds < 10) {
				duration = minutes + ":0" + seconds;
			} else {
				duration = minutes + ":" + seconds;
			}
		}

		/*play the song*/
		audioElement.play();

		/*song interval to move the progress point and change the 
		seconds*/
		setInterval(function() {
			/*get the current time and then calculate the current time and calculate
			our position*/
			current_time = Math.round(audioElement.currentTime);
			current_position = current_time * progress_bar_points;
			
			/*show how far we are through the song*/
			$("#seconds").empty();
			current_time_text = Math.round(audioElement.currentTime);
			if (current_time_text < 10) {	
				current_time_text = "0:0" + current_time_text;
			} else if (current_time_text < 60){
				current_time_text = "0:" + current_time_text;
			} else {
				var minutes = Math.floor(current_time_text / 60);
				var seconds = current_time_text - minutes * 60;
				if (seconds < 10) {
					current_time_text = minutes + ":0" + seconds;
				} else {
					current_time_text = minutes + ":" + seconds;
				}
			}

			/*exit the interval once we reach the end of the song*/
			if (audioElement.currentTime == audioElement.duration) {
				index = s + 1;
				s_index.push(index);

				s = s_index[s_index.length - 1];
				p = p_index[p_index.length - 1];

				if (s == playlists[p].length) {
					s = 0
					s_index.push(s);
				}

				music_player(playlists[p][s]);
				song_menu(playlists[p][s], true);
			} else {
				/*otherwise just keep on changing the position and editing the seconds*/
				$(".progress_point").css("left", String(Math.round(current_position)) + "px");
				$("#seconds").append(current_time_text + "/" + duration);
			}

		}, 1);
	});

}

function currently_playing() {
	$(".currently_playing").remove();
	song_name = audioElement.src
	song_name = song_name.replace(/%20/g, " ");
	song_name = song_name.replace(".wav", "");
	song_name = song_name.split("/")
	song_name = song_name[song_name.length - 1];
	$("." + class_name_music).append("<div class='currently_playing'></div>");
	$(".currently_playing").append("<p id='currently_playing_name'>" + song_name + "</p>");
	$(".currently_playing").append("<p id='currently_playing_sec'></p>");

	setInterval(function() {
		$("#currently_playing_sec").empty();

		current_time_text = current_time;
		if (current_time_text < 10) {	
			current_time_text = "0:0" + current_time_text;
		} else if (current_time_text < 60){
			current_time_text = "0:" + current_time_text;
		} else {
			var minutes = Math.floor(current_time_text / 60);
			var seconds = current_time_text - minutes * 60;
			if (seconds < 10) {
				current_time_text = minutes + ":0" + seconds;
			} else {
				current_time_text = minutes + ":" + seconds;
			}
		}

		$("#currently_playing_sec").append(current_time_text + "/" + duration);
	}, 100);
}

function find_songs(search_term) {
	/*remove everything but not the find_container div and its children*/
	found_songs.length = 0;
	$("#find_title").remove();
	for (i = 0; i < playlists.length; i ++) {
		i = i + playlists[i].length;
	}

	for (x = 0; x < i; x++) {
		$("#found_song" + x).remove();
	}

	$("#song_title").remove();

	$("." + class_name_music).append("<p id='find_title'>Results for: " + search_term + "</p>");
	$("#find_title").css("font-size", "20px");
	$("#find_title").css("text-align", "center");

	index = 0;

	for (i = 0; i < playlists.length; i++) {
		for (x = 0; x < playlists[i].length; x ++) {
			if (playlists[i][x].indexOf(search_term) >= 0) {
				if (index == 0) {
					song_name = playlists[i][x].replace(".wav", "");

					if (song_name.indexOf("--[") >= 0) {
						song_name = song_name.split("--[");
						song_name = song_name[1];
					}

					found_songs.push(song_name);

					$("." + class_name_music).append("<p id='found_song" + index + "'> " + song_name + " </p>");
					$("#found_song" + index).css("text-align", "center");
					$("#found_song" + index).css("background-color", "#B7ADCF");
					index++
				} else {					
					song_name = playlists[i][x].replace(".wav", "");

					if (song_name.indexOf("--[") >= 0) {
						song_name = song_name.split("--[");
						song_name = song_name[1];
					}

					found_songs.push(song_name);

					$("." + class_name_music).append("<p id='found_song" + index + "'> " + song_name + " </p>");
					$("#found_song" + index).css("text-align", "center");

					index++
				}
			}
		}
	}

}


// backspace function for the find function
$(document).on("keydown", function(e) {
    /*if you press backspace*/
    if (e.which == 8) {
		/*prevent backspace from going back to previous page*/
        e.preventDefault();
		
        /*remove last character when backspace is pressed*/
		$("#find_text").text(function (_,txt) {
			/*get the width of the command*/
			$("body").append("<p id='temp'>" + txt.slice(0, -1) + "</p>")

			var length = document.getElementById("temp");
			length.style.fontSize = 15;
			length = (length.clientWidth - 5);

			$("#temp").remove();

			if (length <= 45) {
				//do nothing
			} else {	
				$(".blinking_cursor_music").css("margin-left", length + "px");
				return txt.slice(0, -1);
			}
		});

	}
});


function initiate_music_player() {
	main_menu();
	playlist_index = 0;
	song_index = 0;
	browse_index = 0;

	menu = "playlist_menu";
	
	$("body").keypress(function(key) {
		if (current_dapp == class_name_music) {
			//------------------------------------------------------------------------------------------------------
			if (key.which == 114 && menu == "playlist_menu") { // PRESSED r
				$("." + class_name_music + " > *").remove();
				menu = "song_menu";
				s = s_index[s_index.length - 1];
				p = p_index[p_index.length - 1];
				song_menu(playlists[p][s], false);
				music_player(playlists[p][s]);
			} else if (key.which == 114 && menu == "song_selection") { // PRESSED r
				$("." + class_name_music + " > *").remove();
				menu = "song_menu";
				s = s_index[s_index.length - 1];
				p = p_index[p_index.length - 1];
				song_menu(playlists[p][s], false);				
				music_player(playlists[p][s]);
			}

			//------------------------------------------------------------------------------------------------------
			if (key.which == 119 && menu == "playlist_menu") { // PRESSED w	
				if (playlist_index != 0) {
					playlist_index--;

					if (playlist_index > 9) {
						if (playlist_index < playlists.length - 3) {
							$(".currently_playing").show();
						}
					}

					menu_scroll = menu_scroll - 31;
					$("." + class_name_music).scrollTop(menu_scroll);

					$("#playlist" + String(playlist_index + 1)).css("background-color", "");
					$("#playlist" + String(playlist_index)).css("background-color", "#B7ADCF");
				}

			} else if (key.which == 115 && menu == "playlist_menu") { // PRESSED s
				if (playlist_index != playlist_names.length - 1) {
					playlist_index++;

					if (playlist_index > 9) {	
						if (playlist_index >= playlists.length - 3) {
							$(".currently_playing").hide();
						}					
					}

					menu_scroll = menu_scroll + 31;
					$("." + class_name_music).scrollTop(menu_scroll);

					$("#playlist" + String(playlist_index - 1)).css("background-color", "");
					$("#playlist" + String(playlist_index)).css("background-color", "#B7ADCF");
				}				

			} else if (key.which == 99 && menu == "playlist_menu") { // PRESSED c
				menu = "song_selection";
				$("." + class_name_music + " > *").remove();
				playlist_menu(playlist_index);
				song_index = 0;


				song_scroll = 0;
				$("." + class_name_music).scrollTop(song_scroll);

				if (audioElement.src != "") {
					currently_playing();
				}
			}

			//--------------------------------------------------------------------------------------------------------
			if (key.which == 119 && menu == "song_selection") { // PRESSED w
				if (song_index != 0) {
					song_index--;

					if (song_index > 9) {
						if (song_index < playlists[playlist_index].length - 3) {
							$(".currently_playing").show();
						}		
					}

					song_scroll = song_scroll - 31;
					$("." + class_name_music).scrollTop(song_scroll);

					$("#song" + String(song_index + 1)).css("background-color", "");
					$("#song" + String(song_index)).css("background-color", "#B7ADCF");
				}

			} else if (key.which == 115 && menu == "song_selection") { // PRESSED s
				if (song_index != current_playlist.length - 1) {
					song_index++;

					if (song_index > 9) {
						if (song_index > playlists[playlist_index].length - 3) {
							$(".currently_playing").hide();
						}		
					}

					song_scroll = song_scroll + 31;
					$("." + class_name_music).scrollTop(song_scroll);

					$("#song" + String(song_index - 1)).css("background-color", "");
					$("#song" + String(song_index)).css("background-color", "#B7ADCF");
				}				

			} else if (key.which == 99 && menu == "song_selection") { // PRESSED c

				if (playing) {

					if (song_index == 0) {
						song_name = current_playlist[0].split("--[");
						song_name = song_name[1];

						//append the current playlist/song index to the indexs array
						s_index.push(song_index);
						p_index.push(playlist_index);

						//play the song and setup the UI
						song_menu(song_name, true);
						music_player(song_name);

						menu = "song_menu";
					} else {
						song_name = current_playlist[song_index];

						//append the current playlist/song index to the indexs array
						s_index.push(song_index);
						p_index.push(playlist_index);

						//play the song and setup the UI
						song_menu(song_name, true);
						music_player(song_name);

						menu = "song_menu"
					}

				} else {
					playing = true;
				}

			} else if (key.which == 101 && menu == "song_selection") { // PRESSED e
				playing = false;
				menu = "playlist_menu";

				$("." + class_name_music + " > *").remove();
				main_menu();

				$("." + class_name_music).scrollTop(menu_scroll);


				$("#playlist0").css("background-color", "");
				$("#playlist" + playlist_index).css("background-color", "#B7ADCF");

				if (audioElement.src != "") {
					currently_playing();
				}

			}

			//-----------------------------------------------------------------------------------------------------------
			if (key.which == 101 && menu == "song_menu") { //PRESSED e
				menu = "song_selection";
				$("." + class_name_music).scrollTop(song_scroll);

				/*remove all music player content and append playlist menu content*/
				$("." + class_name_music + " > *").remove();
				playlist_menu(p_index[p_index.length - 1]);
				playlist_index = p_index[p_index.length - 1];
				
				/*change the current highlighted option*/
				$("#song0").css("background-color", "");
				$("#song" + song_index).css("background-color", "#B7ADCF");

				currently_playing();

			} else if (key.which == 32) { // PRESSED [space]
				key.preventDefault();
				time = audioElement.currentTime;
				setTimeout(function() {
					if (time == audioElement.currentTime) {
						audioElement.play();
					} else {
						audioElement.pause();
					}
				}, 100);
			}

			// -------------------------------------------------------------------------------------------------------------
			if (key.which == 102) {
				if (menu != "find_menu") {					
					$("." + class_name_music +" > *").remove();
					$("." + class_name_music).append("<div id='find_container'></div>");
					$("." + class_name_music).append("<p id='song_title'>Find Songs</p>");
					$("#find_container").append("<p id='find_text'>Search:</p>");
					$("#find_container").append("<span class='blinking_cursor_music'>|</span>");					
					menu = "find_menu";
					enter_find_menu = true;
				}
			}

			if (menu == "find_menu") {

				if (key.which == 32) {
					$("#find_text").append("\xa0");
				} else if (key.which == 13) {
					browse_index = 0;
					song_name = $("#find_text").text();
					song_name = song_name.split("Search:")
					find_songs(song_name[1]);
					menu = "browse_found_songs";
				} else {
					if (enter_find_menu == true) {
						enter_find_menu = false;
					} else {	
						key = String.fromCharCode(key.keyCode || key.charCode);
						$("#find_text").append(key);
					}
				}

				length = document.getElementById("find_text");
				length.style.fontSize = 15;
				length = (length.clientWidth - 3);

				$(".blinking_cursor_music").css("margin-left", String(length) + "px");
			}

			//---------------------------------------------------------------------------------------------------------
			if (key.which == 119 && menu == "browse_found_songs") { // PRESSED w
				if (browse_index != 0) {
					browse_index--;

					browse_scroll = browse_scroll - 31;
					$("." + class_name_music).scrollTop(browse_scroll);

					$("#found_song" + String(browse_index + 1)).css("background-color", "");
					$("#found_song" + String(browse_index)).css("background-color", "#B7ADCF");
				}

			} else if (key.which == 115 && menu == "browse_found_songs") { // PRESSED s
				if (browse_index != found_songs.length - 1) {
					browse_index++;

					browse_scroll = browse_scroll + 31;
					$("." + class_name_music).scrollTop(browse_scroll);

					$("#found_song" + String(browse_index - 1)).css("background-color", "");
					$("#found_song" + String(browse_index)).css("background-color", "#B7ADCF");
				}				

			} else if (key.which == 99 && menu == "browse_found_songs") { // PRESSED c
				menu = "song_menu";

				/*find the p and s index so that the song_menu function can set the song path properly*/
				for (i = 0; i < playlists.length; i++) {
					for (x = 0; x < playlists[i].length; x++) {
						
						if (playlists[i][x].indexOf("--[") >= 0) {
							song = playlists[i][x].split("--[");
							song = song[1];

							if (song == found_songs[browse_index] + ".wav") {
								p_index.push(i);
								s_index.push(x);
							}
						} else {						
							if (playlists[i][x] == found_songs[browse_index] + ".wav") {
								p_index.push(i);
								s_index.push(x);
							}
						}
					}
				}

				song_menu(found_songs[browse_index], true);
				music_player(found_songs[browse_index]);
				browse_index = 0;

			} else if (key.which == 101 && menu == "browse_found_songs") { // PRESSED e
				menu = "playlist_menu";
				$("." + class_name_music).scrollTop(song_scroll);
				$("." + class_name_music +" > *").remove();

				playing = false;
				menu = "playlist_menu";

				$("." + class_name_music).scrollTop(menu_scroll);

				$("#playlist0").css("background-color", "");
				$("#playlist" + playlist_index).css("background-color", "#B7ADCF");				

				$("." + class_name_music + " > *").remove();
				main_menu();

				if (audioElement.src != "") {
					currently_playing();
				}

			}
		}

	});	
}

$(document).ready(function() {
	map_playlists();

 	var wait = setInterval(function() {
 		if (playlists) {
 			initiate_music_player()
 			clearInterval(wait);
 		}
 	}, 100);
});