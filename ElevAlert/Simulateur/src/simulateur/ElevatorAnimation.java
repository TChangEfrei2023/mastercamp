package simulateur;

import javafx.animation.FillTransition;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Text;
import javafx.util.Duration;
import java.util.Random;
public class ElevatorAnimation {

    private Elevator elevator;
    private int elevatorPosition;
    private final Rectangle rectangle;
    private final ObservableList<Circle> floors = FXCollections.observableArrayList();
    private Text floorText;
    private int pos;
    private Test test;

    public ElevatorAnimation(Rectangle rectangle){
        this.rectangle = rectangle;
        this.elevatorPosition = (int) rectangle.getTranslateY();

    }

    public Elevator getElevator(){return this.elevator;}

    public void setElevator(Elevator elevator){this.elevator = elevator;}

    public void setFloorText(Text floorText){this.floorText = floorText;}

    public void setTest(Test test){
        this.test = test;
    }


    public Rectangle getRectangle(){
        return this.rectangle;
    }

    public Circle getCurrentCircleFloor(){return this.floors.get(this.elevator.getFloor());}

    public void addCircleFloor(Circle c){this.floors.add(c);}

    public void goUp(int position){
        //We decrease to go up
        for(int i = this.elevatorPosition; i >= position; i--){
            pos = i;
            try{
                Platform.runLater(() -> rectangle.setTranslateY(pos));
                blinkAnimation(i);
                Thread.sleep(10);

            }catch (InterruptedException e){
                System.out.println("The simulation will finish on the floor");
            }
        }
        this.elevatorPosition = position;
    }

    public void goDown(int position){
        //We increase to go down
        for(int i = this.elevatorPosition; i <= position; i++){
            pos = i;
            try{
                Platform.runLater(() -> rectangle.setTranslateY(pos));
                blinkAnimation(i);
                Thread.sleep(10);
            }catch (InterruptedException e){
                System.out.println("The simulation will finish on the floor");
            }
        }
        this.elevatorPosition = position;
    }

    private void blinkAnimation(int i){
        switch (i){

            case 253 -> {new FillTransition(Duration.millis(500), this.floors.get(0), Color.GREEN, Color.DODGERBLUE).play(); this.floorText.setText("0"); this.usingComponents();}
            case 153 -> {new FillTransition(Duration.millis(500), this.floors.get(1), Color.GREEN, Color.DODGERBLUE).play(); this.floorText.setText("1"); this.usingComponents();}
            case 53 ->  {new FillTransition(Duration.millis(500), this.floors.get(2), Color.GREEN, Color.DODGERBLUE).play(); this.floorText.setText("2"); this.usingComponents();}
            case -47 -> {new FillTransition(Duration.millis(500), this.floors.get(3), Color.GREEN, Color.DODGERBLUE).play(); this.floorText.setText("3"); this.usingComponents();}
            case -147 -> {new FillTransition(Duration.millis(500), this.floors.get(4), Color.GREEN, Color.DODGERBLUE).play(); this.floorText.setText("4"); this.usingComponents();}
            case -247 -> {new FillTransition(Duration.millis(500), this.floors.get(5), Color.GREEN, Color.DODGERBLUE).play(); this.floorText.setText("5"); this.usingComponents();}
        }
    }

    public static int randomNumber(int min, int max){
        return new Random().nextInt(max - min + 1) + min;
    }

    public void usingComponents(){
        Platform.runLater(() -> test.generateBreakdown());
    }

}
