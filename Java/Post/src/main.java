import java.io.IOException;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class main {
	static String user, pwd, schno;
	static ArrayList<String> date = new ArrayList<String>();
	static ArrayList<String> work = new ArrayList<String>();

	public static void main(String[] args) {
		if (args[0] != (null)) {
			//資料處理
			main jsondata = new main();
			jsondata.jsondata(args[0]);
			try {
				Post http = new Post(user, pwd, schno);
				//判斷帳號密碼是否正確
				if(http.login == true){
					for (int i = 0; i < date.size(); i++) {
						http.Updata(date.get(i), work.get(i));
					}
					System.out.println("OK");
				}
				else{
					System.out.println("ERROR");
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			System.out.println("Proper Usage is: java program filename");
			System.exit(0);
		}
	}

	private void jsondata(String data) {
		try {
			JSONObject json = new JSONObject(data);
			user = json.get("user").toString();
			pwd = json.get("pwd").toString();
			schno = json.get("schno").toString();
			JSONArray day = json.getJSONArray("day");
			for (int i = 0; i < day.length(); i++) {
				date.add(day.getJSONObject(i).get("date").toString());
				work.add(day.getJSONObject(i).get("work").toString());
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}