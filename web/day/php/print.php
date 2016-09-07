<?PHP
if(!isset($_GET["action"]) && !isset($_GET["data"])){

	$output = shell_exec("java -jar jar/NCHU.jar PrintRecord $data");
	$output = iconv("big5","UTF-8",$output);
	echo $output;
}



?>