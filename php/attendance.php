<?PHP
include_once('simple_html_dom.php');

class Attendance 
{
	private $Web_login = "http://psf.nchu.edu.tw/punch/login_chk.jsp";
	private $Web_save = "http://psf.nchu.edu.tw/punch/PunchTbl_save";
	private $Web_record = "http://psf.nchu.edu.tw/punch/PunchTbl_Q";
	private $Web_print = "http://psf.nchu.edu.tw/punch/FormPunch_A.jsp";
	private $Web_schno = "http://psf.nchu.edu.tw/punch/ComeQueryPunch_A.jsp";
	private $JSESSIONID= null;

	/* 
	 * * * * * * * * * * * DelRecord * * * * * * * * * * * 
	 */
	function DelRecord($rid, $jessionID){
		$PostData = "delete=true&rid=".$rid;

		$ch = curl_init();
		// setting post url
		curl_setopt($ch, CURLOPT_URL, $this->Web_save);

		// use post mode
		curl_setopt( $ch, CURLOPT_POST, 1);
		
		// return web content
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

		// post data content
		curl_setopt($ch, CURLOPT_POSTFIELDS, $PostData);

		// setting cookie
		curl_setopt($ch, CURLOPT_COOKIE, "JSESSIONID=".$jessionID);

		$result = curl_exec($ch);
	}

	/* 
	 * * * * * * * * * * * AddRecord * * * * * * * * * * * 
	 */
	function AddRecord($date, $work, $schno, $jessionID){
		$PostData = "insert=true&date=".$date."&work=".$work."&schno=".$schno;

		$ch = curl_init();
		// setting post url
		curl_setopt($ch, CURLOPT_URL, $this->Web_save);

		// use post mode
		curl_setopt( $ch, CURLOPT_POST, 1);
		
		// return web content
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

		// post data content
		curl_setopt($ch, CURLOPT_POSTFIELDS, $PostData);

		// setting cookie
		curl_setopt($ch, CURLOPT_COOKIE, "JSESSIONID=".$jessionID);

		$result = curl_exec($ch);
	}

	/* 
	 * * * * * * * * * * * PrintRecord * * * * * * * * * * * 
	 */
	function PrintRecord($schno, $dateBeg, $dateEnd, $jessionID){
		$GetData = "?schno=".$schno."&dtQryBeg=".$dateBeg."&dtQryEnd=".$dateEnd;

		$ch = curl_init();
		
		// setting post url
		curl_setopt($ch, CURLOPT_URL, $this->Web_print.$GetData);
		
		// return web content
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
		
		// setting cookie
		curl_setopt($ch, CURLOPT_COOKIE, "JSESSIONID=".$jessionID);

		$result = curl_exec($ch);

		return $result;
	}

	/* 
	 * * * * * * * * * * * GetRecord * * * * * * * * * * * 
	 */
	function GetRecord($user, $jessionID){
		$GetData = "?acc=".$user;
		
		$ch = curl_init();
		
		// setting post url
		curl_setopt($ch, CURLOPT_URL, $this->Web_record.$GetData);
		
		// return web content
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
		
		// setting cookie
		curl_setopt($ch, CURLOPT_COOKIE, "JSESSIONID=".$jessionID);

		$result = curl_exec($ch);

		return $result;

	}

	/* 
	 * * * * * * * * * * * GetSchno * * * * * * * * * * * 
	 */
	function GetSchno($jessionID){
		$data = array();

		$ch = curl_init();
		
		// setting post url
		curl_setopt($ch, CURLOPT_URL, $this->Web_schno);
		
		// return web content
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
		
		// setting cookie
		curl_setopt($ch, CURLOPT_COOKIE, "JSESSIONID=".$jessionID);

		$result = curl_exec($ch);

		$Htmlparser = str_get_html($result);
		foreach($Htmlparser->find('option') as $element) 
       		array_push($data,$element->value);
		return $data;
	}


	/* 
	 * * * * * * * * * * * GetJSESSIONID * * * * * * * * * * * 
	 */

	function GetJSESSIONID(){
		return $this->JSESSIONID;
	}

	/* 
	 * * * * * * * * * * * Login * * * * * * * * * * * 
	 */
	function Login($user,$pwd){
		$PostData = "txtLoginID=".$user."&txtLoginPWD=".$pwd;

		$ch = curl_init();
		// setting post url
		curl_setopt($ch, CURLOPT_URL, $this->Web_login);

		// use post mode
		curl_setopt( $ch, CURLOPT_POST, 1);
		
		// return web content
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
		
		// get web request header
		curl_setopt( $ch, CURLOPT_HEADER, 1);

		// post data content
		curl_setopt($ch, CURLOPT_POSTFIELDS, $PostData);

		$result = curl_exec($ch);
		
		$cookie = $this->ParserCookie($result);
		$this->JSESSIONID = $cookie["JSESSIONID"];

		curl_close($ch);

		if(strpos($result,'Menu') !== FALSE){
			return TRUE;
		}else{
			return FALSE;
		}
	}

	function ParserCookie($result){
		preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $result, $matches);
		$cookies = array();
		foreach($matches[1] as $item) {
    		parse_str($item, $cookie);
    		$cookies = array_merge($cookies, $cookie);
		}
		return $cookies;
	}
}

// $aaa = new Attendance();
// if($aaa->Login("N125359408","820304")){
// 	$session = $aaa->GetJSESSIONID();
// 	// $aaa->DelRecord("AAAWcbAAIAAAd4NAAv",$session);
// 	// AAAWcbAAIAAAd4NAAv
// 	// $aaa->AddRecord("1060501","整理資料","105B1200",$session);
// 	// echo 1060428


// 	// echo $aaa->PrintRecord("105B1200","1060401","1060430",$session);

// 	// echo $aaa->GetRecord("N125359408",$session);

// 	// foreach($aaa->GetSchno($aaa->GetJSESSIONID()) as $i){
// 	// 	echo $i."\n";
// 	// }
// }
?>