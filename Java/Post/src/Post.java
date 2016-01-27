import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

public class Post {
	String JSESSIONID = null;
	String user, pwd, schno;
	Boolean login = false;

	public Post(String user, String pwd, String schno) throws UnsupportedEncodingException, IOException {
		this.user = user;
		this.pwd = pwd;
		this.schno = schno;
		this.GetJsessionID();
	}

	private void GetJsessionID() throws UnsupportedEncodingException, IOException {
		URL url = new URL("http://psf.nchu.edu.tw/punch/login_chk.jsp");
		HttpURLConnection http = (HttpURLConnection) url.openConnection();

		http.setRequestMethod("POST");
		http.setDoOutput(true);

		String data = "txtLoginID=" + user + "&txtLoginPWD=" + pwd;
		DataOutputStream wr = new DataOutputStream(http.getOutputStream());
		wr.write(data.getBytes("utf-8"));
		wr.close();

		Map<String, List<String>> requestCookie = http.getHeaderFields();
		for (int i = 0; i < requestCookie.get("Set-Cookie").size(); i++) {
			if (requestCookie.get("Set-Cookie").get(i).contains("JSESSIONID")) {
				JSESSIONID = requestCookie.get("Set-Cookie").get(i).split("=")[1].split(";")[0];
			}
		}
		http.getResponseCode();

		BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
		if (response.toString().contains("Menu")) {
			login = true;
		}
	}

	public void Updata(String date, String work) throws UnsupportedEncodingException, IOException {
		URL url = new URL("http://psf.nchu.edu.tw/punch/PunchTbl_save");
		HttpURLConnection http = (HttpURLConnection) url.openConnection();

		http.setRequestProperty("Cookie", "JSESSIONID=" + JSESSIONID);
		http.setRequestMethod("POST");
		http.setDoOutput(true);

		String data = "insert=true&date=" + date + "&work=" + work + "&schno=" + schno;
		DataOutputStream wr = new DataOutputStream(http.getOutputStream());
		wr.write(data.getBytes("utf-8"));
		wr.close();

		http.getResponseCode();
	}
}