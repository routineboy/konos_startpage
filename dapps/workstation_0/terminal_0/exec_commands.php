<?php
	if(isset($_POST["command"])) {
		$command = $_POST["command"];
		$command = split(":", $command);
		$command_type = $command[0];

		if ($command_type == "download_song") {
			$dir_1 = "C:\Python27\Lib\site-packages\youtube_dl\__main__.py";
			$dir_2 = "https://www.youtube.com/watch?v=" . $command[1];

			$download_command = ("python " . escapeshellarg($dir_1) . " -f 140 " . escapeshellarg($dir_2));

			$descriptorspec = array(
			   0 => array("pipe", "r"),  // stdin
			   1 => array("pipe", "w"),  // stdout
			   2 => array("pipe", "w"),  // stderr
			);

			$process = proc_open($download_command, $descriptorspec, $pipes);
			$stdout = stream_get_contents($pipes[1]);
			fclose($pipes[1]);
			$stderr = stream_get_contents($pipes[2]);
			fclose($pipes[2]);
			$ret = proc_close($process);

			$dest = split("\r\n", $stdout);
			$dest = $dest[5];
			$dest = split("Destination: ", $dest);
			$dest = $dest[1];

			if (file_exists($dest . ".part")) {
				echo "it exists";
			} else {
				echo "you fricked fam";
			}

		} elseif ($command_type == "download_image") {
			echo "Not implemented";
		}
	}

	/*"youtube-dl -f 140 https://www.youtube.com/watch?v=" + $command[1]*/

?>
