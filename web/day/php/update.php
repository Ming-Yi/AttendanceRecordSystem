<?PHP
	if(isset($_POST["data"])){
		$data = "";
		$data .= $_POST["data"];
		$data = iconv("UTF-8","big5",$data);
	}
	else{
		exit();
	}	

	exec("java -jar jar/money.jar $data",$output,$return_var);
	if($output[0]=="ERROR"){
		echo "ERROR";
	}
	else{
		echo "OK";
	}
	
?>