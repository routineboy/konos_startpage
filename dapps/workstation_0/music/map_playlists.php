<?php
	$url = 'http://50.72.73.61/drive_a/konos/music';
	$html = file_get_contents($url);
	$count = preg_match_all('/<td><a href="([^"]+)">[^<]*<\/a><\/td>/i', $html, $files);

	for ($i = 0; $i < $count; ++$i) {
		$dir_name = $files[1][$i];
		$url_2 = 'http://50.72.73.61/drive_a/konos/music/' . $dir_name;
		$html_2 = file_get_contents($url_2);
		$count_2 = preg_match_all('/<td><a href="([^"]+)">[^<]*<\/a><\/td>/i', $html_2, $files_2);

		$songs = [];

		for ($x = 0; $x < $count_2; ++$x) {
			$file_name = $files_2[1][$x];
			if (strpos($file_name, "img/") !== false) {

			} elseif (strpos($file_name, "/drive_a/konos/music") !== false) {

			} else {
				$file_name = str_replace("%20", " ", $file_name);
				array_push($songs, $file_name);
			}
		}

		if (strpos($dir_name, "/drive_a/konos/") !== false) {

		} else {
			$playlist = str_replace("/", "", $dir_name);
			$playlist = str_replace("%20", " ", $playlist);
			echo $playlist . "--" . json_encode($songs);
		}

	}

?>