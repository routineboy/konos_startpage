<?php
	$workstations = array_diff(scandir("../dapps"), array("..", ".", "main_style", "mobile"));
	$dapp_array = [];

	foreach ($workstations as &$workstation) {
		$dapps = scandir("../dapps/" . $workstation);
		echo json_encode($dapps);
	}
?>