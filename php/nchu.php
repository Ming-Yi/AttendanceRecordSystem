<?PHP
	include_once("attendance.php");
	if(!isset($_POST["action"]) && !isset($_POST["data"]))
		exit();

	putenv('LANG=zh_TW.utf8'); 

	$action = $_POST["action"];
	// $data = "'".$_POST["data"]."'";
	$data = $_POST["data"];
	$attendance = new Attendance();

	$json = json_decode($data);
	switch ($action) {
		case 'Login':
			if($attendance->Login($json->user, $json->pwd)){
				$jsession = $attendance->GetJSESSIONID();
				$Schnos = $attendance->GetSchno($jsession);
				$str = "{\"jsession\":\"".$jsession."\",\"schnos\":[";

				foreach($Schnos as $Schno){
					$str .= "\"".$Schno."\",";
				}
				$str = substr($str, 0, -1)."]}";
				echo $str;
			}else{
				echo "{\"state\":\"failed\"}";
			}
			break;

		case 'GetRecord':
			$jsession = $json->jsession;
			$user = $json->user;
			echo $attendance->GetRecord($user, $jsession);
			break;

		case 'AddRecord':
			$jsession = $json->jsession;
			$schno = $json->schno;

			$days = $json->day;
			foreach($days as $day){
				$date = $day->date;
				$work = $day->work;
				$attendance->AddRecord($date, $work, $schno, $jsession);
			}
			echo "{\"state\":\"success\"}";
			break;

		case 'DelRecord':
			$jsession = $json->jsession;

			$rids = $json->rid;
			foreach($rids as $rid){
				$attendance->DelRecord($rid, $jsession);
			}
			echo "{\"state\":\"success\"}";
			break;

		case 'PrintRecord':
			$jsession = $json->jsession;
			$schno = $json->schno;

			$dateBeg = $json->dateBeg;
			$dateEnd = $json->dateEnd;
			echo $attendance->PrintRecord($schno, $dateBeg, $dateEnd, $jsession);
			break;
	}
	
?>