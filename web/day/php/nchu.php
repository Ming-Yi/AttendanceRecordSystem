<?PHP
	if(!isset($_POST["action"]) && !isset($_POST["data"]))
		exit();

	putenv('LANG=zh_TW.utf8'); 

	$action = $_POST["action"];
	$data = "'".$_POST["data"]."'";
	// $data = "'".$_POST["data"]."'";
	// echo $data;

	$output = shell_exec("/var/packages/Java8/target/j2sdk-image/bin/java -jar jar/NCHU.jar $action $data");
	echo $output;	
?>