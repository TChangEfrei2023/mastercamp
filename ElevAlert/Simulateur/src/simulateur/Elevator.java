package simulateur;

import javafx.collections.ObservableList;

public class Elevator {
    private int id;
    private int floor = 0;
    private ObservableList<Component> componentList;
    public Elevator(){
    	
    }
 

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
