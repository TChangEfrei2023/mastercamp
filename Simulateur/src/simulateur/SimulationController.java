package simulateur;

import javafx.collections.ObservableList;
import javafx.concurrent.Worker;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Text;
import java.net.URL;
import java.util.ResourceBundle;

public class SimulationController implements Initializable {
    @FXML
    private Circle circleGf, circle1, circle2, circle3, circle4, circle5;
    @FXML
    private  Text testText, buildingNameText, floorText;
    @FXML
    private Rectangle elevatorRectangle;
    @FXML
    private Button launchButton;
    @FXML
    private Button stopButton;
    @FXML
    private Button repareButton;
    @FXML
    private TableView<Component> tableViewComponents;
    @FXML
    private TableColumn<Component, Integer> idColumn, durabilityColumn;
    @FXML
    private TableColumn<Component, String>nameColumn;
    @FXML
    private TextField idElevatorTextField;
    @FXML
    private PasswordField passwordField;
    @FXML
    private Button submitButton;

    private BackgroundTask backgroundTask;

    private ObservableList<Component> componentList;

    private Request resquest = new Request();

    private Elevator elevator;

    private ElevatorAnimation elevatorAnimation;

    private Test testElevator;

    private boolean alreadyConnected;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        //Initialization
        this.elevator = new Elevator();
        this.floorText.setText("0");
        this.testText.setText(null);
        this.elevatorAnimation = new ElevatorAnimation(this.elevatorRectangle);
        this.elevatorAnimation.setElevator(elevator);
        this.elevatorAnimation.setFloorText(this.floorText);
        this.backgroundTask = new BackgroundTask(elevatorAnimation);
        this.buildingNameText.setText("BAT. A");
        //Adding circle floor in to the elevator
        this.elevatorAnimation.addCircleFloor(circleGf);
        this.elevatorAnimation.addCircleFloor(circle1);
        this.elevatorAnimation.addCircleFloor(circle2);
        this.elevatorAnimation.addCircleFloor(circle3);
        this.elevatorAnimation.addCircleFloor(circle4);
        this.elevatorAnimation.addCircleFloor(circle5);
        //Initializing tableView
        idColumn.setCellValueFactory(new PropertyValueFactory<>("idComponent"));
        durabilityColumn.setCellValueFactory(new PropertyValueFactory<>("durability"));
        nameColumn.setCellValueFactory(new PropertyValueFactory<>("nom"));

        this.repareButton.setDisable(true);

        alreadyConnected = false;
    }

    @FXML
    public void onActionLaunch() {
        if(this.backgroundTask.getState() == Worker.State.CANCELLED){
            this.backgroundTask.restart();
            this.launchButton.setDisable(true);
            this.stopButton.setDisable(false);
        }
        if(!this.backgroundTask.isRunning()){
            this.backgroundTask.createTask();
            this.backgroundTask.start();
            this.launchButton.setDisable(true);
            this.stopButton.setDisable(false);
        }
    }

    @FXML
    public void onActionStop() {
        if(this.backgroundTask.isRunning()){
            this.backgroundTask.cancel();
            this.stopButton.setDisable(true);
            this.launchButton.setDisable(false);
        }

    }

    public static void alertBox(Alert.AlertType alertType,String header, String boxName, String message){
        Alert alert = new Alert(alertType);
        alert.setTitle(boxName);
        alert.setHeaderText(header);
        alert.setContentText(message);
        alert.show();
    }
    
    @FXML
    public void onActionSubmit() {
        //Connection
        resquest.login(this.idElevatorTextField.getText(), this.passwordField.getText(),this.alreadyConnected);
        System.out.println("Login " + this.idElevatorTextField.getText() + " password " + this.passwordField.getText());
        if(resquest.isConnected()){
            alertBox(Alert.AlertType.INFORMATION, "Success", "InfoBox", "The connection to the server succeded");
            this.alreadyConnected = true;
        }
        else{
            alertBox(Alert.AlertType.ERROR, "Fail", "InfoBox", "The connection to the server failed");
        }

        this.componentList = resquest.getListComponent();
        this.tableViewComponents.setItems(this.componentList);
        //Creating test elevator
        this.testElevator = new Test(this.componentList);
        this.testElevator.setRequest(this.resquest);
        this.testElevator.setTextTest(this.testText);
        this.testElevator.setBackgroundTask(this.backgroundTask);
        this.testElevator.setTableView(this.tableViewComponents);
        this.testElevator.setRepareButton(this.repareButton);
        this.elevatorAnimation.setTest(this.testElevator);
    }
    
    @FXML
    public void onActionRepare() {
        Component component = this.tableViewComponents.getSelectionModel().getSelectedItem();
        this.testElevator.repareComponent(component);
        this.testText.setText(null);
        this.launchButton.setDisable(false);    }
}
