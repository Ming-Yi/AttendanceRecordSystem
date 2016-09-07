<?PHP
	if(!isset($_POST["action"]) && !isset($_POST["data"]))
		exit();
	$action = $_POST["action"];
	$data = $_POST["data"];
	$data = iconv("UTF-8","big5",$data);

	$output = shell_exec("java -jar jar/NCHU.jar $action $data");
	$output = iconv("big5","UTF-8",$output);
	echo $output;	
?>