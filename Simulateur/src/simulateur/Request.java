package simulateur;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Request {
    private HttpClient client;
    private String address;
    private boolean connected;

    public Request() {
    	address = "http://192.168.43.23:3000/api";
        CookieHandler.setDefault(new CookieManager());

        client = HttpClient.newBuilder()
                .cookieHandler(CookieHandler.getDefault())
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    public void login(String idElevator, String password, boolean alreadyConnected){
    	if(alreadyConnected) {
    		System.out.println("Hello");
            HttpRequest requestDisconnect = HttpRequest.newBuilder()
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .uri(URI.create(this.address+"/logout"))
                    .setHeader("User-Agent", "Java 11 HttpClient Bot") // add request header
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .build();
            try {
                HttpResponse<String> responseDisconnect = client.send(requestDisconnect, HttpResponse.BodyHandlers.ofString());//Sending the request
                System.out.println("message server login " + responseDisconnect.body());
                this.connected = false;
            } catch(Exception e) {
                e.printStackTrace();
                this.connected = false;
            }
    	}
    	
        String url = this.address + "/connect";
        Map<String, String> body = new HashMap<>();
        body.put("idElevator", idElevator);
        body.put("password", password);

        HttpRequest request = HttpRequest.newBuilder()
                .POST(buildFormDataFromMap(body))
                .uri(URI.create(url))
                .setHeader("User-Agent", "Java 11 HttpClient Bot") // add request header
                .header("Content-Type", "application/x-www-form-urlencoded")
                .build();
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());//Sending the request
            System.out.println("message server login " + response.body());
            if(response.body().contains("User not connected"))
                this.connected = false;
            else
                this.connected = true;
        } catch(Exception e) {
            e.printStackTrace();
            this.connected = false;
        }
    }

    public ObservableList<Component> getListComponent() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(this.address + "/components"))
                .GET()
                .setHeader("User-Agent", "Java 11 HttpClient Bot") // add request header
                .header("Content-Type", "application/x-www-form-urlencoded")
                .build(); 
        try {

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());
            String bodyString = response.body();
            System.out.println(bodyString);
    		int cutContent = bodyString.indexOf("content\":")+9;
    		bodyString = bodyString.substring(cutContent,bodyString.length());
            ObjectMapper objMap = new ObjectMapper();
            List<Component> list= objMap.readValue(bodyString, new TypeReference<ArrayList<Component>>(){});
            for(var i : list) {
                if(i.getStatus())
                    i.setDurability(100);
                else
                	i.setDurability(0);
            }
            ObservableList<Component> listComponent = FXCollections.observableArrayList(list);
            return listComponent;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public static String[] stringToArray(String[] strArray, Pattern pattern) {
        String[] arr = strArray;
        Matcher matcher;
        for(int i=1;i<strArray.length;i++) {
            matcher = pattern.matcher(strArray[i]);
            if(matcher.find()) {
                arr[i-1] = matcher.group(0);
            }
        }
        return arr;
    }

    private static<T,S> HttpRequest.BodyPublisher buildFormDataFromMap(Map<T, S> data) {
        var builder = new StringBuilder();
        for (var entry : data.entrySet()) {
            if (builder.length() > 0) {
                builder.append("&");
            }
            builder.append(URLEncoder.encode(entry.getKey().toString(), StandardCharsets.UTF_8));
            builder.append("=");
            builder.append(URLEncoder.encode(entry.getValue().toString(), StandardCharsets.UTF_8));
        }
        System.out.println(builder);
        return HttpRequest.BodyPublishers.ofString(builder.toString());
    }

    public void putRequest(int idComponent){
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(this.address + "/error/" + idComponent))
                .PUT(HttpRequest.BodyPublishers.noBody())
                .timeout(Duration.ofSeconds(5))
                .setHeader("User-Agent", "Java 11 HttpClient Bot") // add request header
                .header("Content-Type", "application/x-www-form-urlencoded")
                .build();
        try{
            client.sendAsync(request, HttpResponse.BodyHandlers.ofString()).thenApply(HttpResponse::body)
                    .thenAccept(System.out::println);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println("ERROR PUT REQUEST");
        }
    }

    public void postRequest(int idComponent){

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(this.address + "/repaired/" + idComponent))
                .POST(HttpRequest.BodyPublishers.noBody())
                .timeout(Duration.ofSeconds(5))
                .setHeader("User-Agent", "Java 11 HttpClient Bot") // add request header
                .header("Content-Type", "application/x-www-form-urlencoded")
                .build();
        try{
            CompletableFuture<Void> reponse = client.sendAsync(request, HttpResponse.BodyHandlers.ofString()).thenApply(HttpResponse::body)
                    .thenAccept(System.out::println);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println("ERROR POST REQUEST");
        }

    }

    public boolean isConnected(){
        return this.connected;
    }

}
