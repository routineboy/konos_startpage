<?php
	if(isset($_POST["song_name"])) {
		$song_name = explode(".", $_POST["song_name"]);
		$song_name = $song_name[0];

		$playlist_name = explode(":", $_POST["song_name"]);
		$playlist_name = $playlist_name[1];
		$playlist_name = str_replace(" ", "%20", $playlist_name);

		$url = 'http://50.72.73.61/drive_a/konos/music/' . $playlist_name . "/img";
		$html = file_get_contents($url);
		$count = preg_match_all('/<td><a href="([^"]+)">[^<]*<\/a><\/td>/i', $html, $files);		

		for($i = 0; $i < $count; ++$i) {
			$img_name = $files[1][$i];
			$img_name = str_replace("%20", " ", $img_name);

			/*echo $img_name . "  -----  " . $song_name . "\n";*/
			if (strpos($img_name, $song_name) !== false) {
				echo $img_name;
			}
		}


	}
?>