import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Attendance {
	private final String Web_login = "http://psf.nchu.edu.tw/punch/login_chk.jsp";
	private final String Web_save = "http://psf.nchu.edu.tw/punch/PunchTbl_save";
	private final String Web_record = "http://psf.nchu.edu.tw/punch/PunchTbl_Q";
	private final String Web_print = "http://psf.nchu.edu.tw/punch/FormPunch_A.jsp";
	private final String Web_schno = "http://psf.nchu.edu.tw/punch/ComeQueryPunch_A.jsp";
	private String JSESSIONID= null;
	
	public Attendance(){

	}
	
	public ArrayList GetSchno(String jessionID) throws IOException{
		URL url = new URL(Web_schno);
		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		
		http.setRequestProperty("Cookie", "JSESSIONID=" + jessionID);
		http.setRequestMethod("GET");

        int responseCode = http.getResponseCode();
        StringBuffer response = new StringBuffer();
        
		BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream()));
		String inputLine;
		
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();  		
        
        Document doc = Jsoup.parse(response.toString(), "UTF-8");
        ArrayList<String> data = new ArrayList<String>();
        Elements schnos = doc.getElementsByTag("option");
        for(Element schno : schnos ){
        	data.add(schno.val());
        }

        //System.out.println(data.toString().substring(0,data.length()-1));
        
		return data;
	} 
	
	public String PrintRecord(String schno ,String dateBeg ,String dateEnd ,String jessionID) throws IOException{
		URL url = new URL(Web_print+"?schno="+schno+"&dtQryBeg="+dateBeg+"&dtQryEnd="+dateEnd);
		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		
		http.setRequestProperty("Cookie", "JSESSIONID=" + jessionID);
		http.setRequestMethod("GET");
		
        int responseCode = http.getResponseCode();
        StringBuffer response = new StringBuffer();
        
    	BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream(),"UTF-8"));
		String inputLine;
		
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();  		

        //System.out.println(response.toString());
        return response.toString();
	}
	
	public void AddRecord(String date, String work ,String schno ,String jessionID) throws IOException{
		URL url = new URL(Web_save);
		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		
		//設定Cookie
		http.setRequestProperty("Cookie", "JSESSIONID=" + jessionID);
		
		//設定Request為POST
		http.setRequestMethod("POST");
		http.setDoOutput(true);

		String data = "insert=true&date=" + date + "&work=" + work + "&schno=" + schno;
		DataOutputStream wr = new DataOutputStream(http.getOutputStream());
		wr.write(data.getBytes("utf-8"));
		wr.close();

		http.getResponseCode();
	}
	
	public void DelRecord(String rid ,String jessionID) throws IOException{
		URL url = new URL(Web_save);
		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		
		//設定Cookie
		http.setRequestProperty("Cookie", "JSESSIONID=" + jessionID);
		http.setUseCaches (true);
		
		//設定Request為POST
		http.setRequestMethod("POST");
		http.setDoOutput(true);
		
		String data = "delete=true&rid="+URLEncoder.encode(rid, "utf-8");

		DataOutputStream wr = new DataOutputStream(http.getOutputStream());
		wr.write(data.getBytes("utf-8"));
		wr.close();

		http.getResponseCode();
	}
	
	//取得出勤紀錄(Json)
	public String GetRecord(String user,String jessionID) throws IOException{
		URL url = new URL(Web_record+"?acc="+user);
		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		
		http.setRequestProperty("Cookie", "JSESSIONID=" + jessionID);
		http.setRequestMethod("GET");
		
        int responseCode = http.getResponseCode();
        StringBuffer response = new StringBuffer();
        
		BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream(),"UTF-8"));
		String inputLine;
		
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();  		

        return response.toString();
	}

	
	public String GetJSESSIONID(){
		return JSESSIONID;
	}
	
	//Login 並取得JSESSIONID
	public boolean Login(String user,String pwd) throws IOException{
		URL url = new URL(Web_login);
		HttpURLConnection http = (HttpURLConnection) url.openConnection();
		
		http.setRequestMethod("POST");
		http.setDoOutput(true);

		String data = "txtLoginID=" + user + "&txtLoginPWD=" + pwd;
		DataOutputStream wr = new DataOutputStream(http.getOutputStream());
		wr.write(data.getBytes("utf-8"));
		wr.close();
		
		Map<String, List<String>> requestCookie = http.getHeaderFields();
		//System.out.println(requestCookie);
		
		for (int i = 0; i < requestCookie.get("Set-Cookie").size(); i++) {
			if (requestCookie.get("Set-Cookie").get(i).contains("JSESSIONID")) {
				JSESSIONID = requestCookie.get("Set-Cookie").get(i).split("=")[1].split(";")[0];
			}
		}
		http.getResponseCode();
		
		//接收網頁標籤資訊，確認是否登入成功
		BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
		
		//System.out.println(response.toString());
		
		if (response.toString().contains("Menu")) {
			return true;
		}
		return false;
	}
}
