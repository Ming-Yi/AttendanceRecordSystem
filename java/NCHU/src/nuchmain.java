import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class nuchmain {
	public static void main(String[] args) throws IOException, JSONException {
		Attendance attendance = new Attendance();
		switch(args[0]){
			case "Login":{
				JSONObject json = new JSONObject(args[1]);

				
				String user = json.get("user").toString();
				String pwd = json.get("pwd").toString();
				
				if(attendance.Login(user, pwd)){
					String JSESSIONID = attendance.GetJSESSIONID();
					ArrayList Schnos = attendance.GetSchno(JSESSIONID);
					
					//轉換成JSON
					String str = "{\"jsession\":\""+JSESSIONID+"\",\"schnos\":[";
					for(int i=0 ;i < Schnos.size();i++){
						str +="\""+Schnos.get(i)+"\",";
					}
					str = str.substring(0,str.length()-1)+"]}";
					System.out.println(str);
				}
				else{
					System.out.println("{\"state\":\"failed\"}");
				}
				
				break;
			}
			case "AddRecord":{		
				JSONObject json = new JSONObject(args[1]);
				
				String jsession = json.get("jsession").toString();
				String schno = json.get("schno").toString();
				
				JSONArray day = json.getJSONArray("day");
				for (int i = 0; i < day.length(); i++) {
					String date = day.getJSONObject(i).get("date").toString();
					String work = day.getJSONObject(i).get("work").toString();
					attendance.AddRecord(date, work, schno, jsession);
				}

				System.out.println("{\"state\":\"success\"}");
				break;
			}

			case "PrintRecord":{		
				JSONObject json = new JSONObject(args[1]);
				
				String jsession = json.get("jsession").toString();
				String schno = json.get("schno").toString();
				String dateBeg = json.get("dateBeg").toString();
				String dateEnd = json.get("dateEnd").toString();
				
				String data = attendance.PrintRecord(schno, dateBeg, dateEnd, jsession);
				System.out.println(data);
				
				break;
			}
			case "GetRecord":{
				JSONObject json = new JSONObject(args[1]);
				
				String jsession = json.get("jsession").toString();
				String user = json.get("user").toString();
				String data = attendance.GetRecord(user,jsession);
				System.out.println(data);
				
				break;
			}	
			case "DelRecord":{
				JSONObject json = new JSONObject(args[1]);
				
				String jsession = json.get("jsession").toString();
				JSONArray rid = json.getJSONArray("rid");
				for(int i=0;i<rid.length();i++){
					attendance.DelRecord(rid.get(i).toString(), jsession);
				}
				
				System.out.println("{\"state\":\"success\"}");
		
				break;
			}
		}
	}
}
