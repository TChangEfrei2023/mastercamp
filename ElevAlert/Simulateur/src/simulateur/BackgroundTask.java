package simulateur;

import javafx.concurrent.Service;
import javafx.concurrent.Task;
import javafx.scene.paint.Color;

public class BackgroundTask extends Service<ElevatorAnimation> {

    private final ElevatorAnimation elevatorAnimation;

    private Test test;

    public BackgroundTask(ElevatorAnimation elevatorAnimation){
        this.elevatorAnimation = elevatorAnimation;
    }

    public ElevatorAnimation getElevatorAnimation() {
        return elevatorAnimation;
    }

    public void setTest(Test test){this.test = test;}


    @Override
    protected Task<ElevatorAnimation> createTask() {
        return new Task<>() {
            @Override
            protected ElevatorAnimation call(){
                ElevatorAnimation elevatorAnimation = getElevatorAnimation();
                while (!isCancelled()) {
                   int targetFloor = ElevatorAnimation.randomNumber(0,5);
                   int currentFloor = elevatorAnimation.getElevator().getFloor();

                   if(targetFloor > currentFloor) {//if the target floor is an upper floor
                       switch (targetFloor) {
                           case 1 -> elevatorAnimation.goUp(153);
                           case 2 -> elevatorAnimation.goUp(53);
                           case 3 -> elevatorAnimation.goUp(-47);
                           case 4 -> elevatorAnimation.goUp(-147);
                           default -> elevatorAnimation.goUp(-247);
                       }
                   }
                    if(targetFloor < currentFloor){//if the target floor is an lower floor
                        switch (targetFloor) {
                            case 0 -> elevatorAnimation.goDown(253);
                            case 1 -> elevatorAnimation.goDown(153);
                            case 2 -> elevatorAnimation.goDown(53);
                            case 3 -> elevatorAnimation.goDown(-47);
                            default -> elevatorAnimation.goDown(-147);
                        }
                    }
                    elevatorAnimation.getElevator().setFloor(targetFloor); //Updating the current floor of the elevator
                    double initialStrokeWidth = elevatorAnimation.getCurrentCircleFloor().getStrokeWidth();
                    elevatorAnimation.getCurrentCircleFloor().setStrokeWidth(5);//Modifying the stroke width
                    elevatorAnimation.getCurrentCircleFloor().setStroke(Color.RED);
                    try{
                        Thread.sleep(2000);//wait two seconds when we reach the floor
                        elevatorAnimation.getCurrentCircleFloor().setStroke(Color.BLACK);
                        elevatorAnimation.getCurrentCircleFloor().setStrokeWidth(initialStrokeWidth);
                    }catch (InterruptedException e){
                        elevatorAnimation.getCurrentCircleFloor().setStroke(Color.BLACK);
                        elevatorAnimation.getCurrentCircleFloor().setStrokeWidth(initialStrokeWidth);
                    }
                }
                return elevatorAnimation;
            }
        };
    }
}
