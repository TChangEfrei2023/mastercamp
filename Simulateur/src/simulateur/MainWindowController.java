package simulateur;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.ChoiceBox;
import javafx.stage.Stage;


import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class MainWindowController implements Initializable {

    @FXML
    private ChoiceBox<Integer> elevatorNumberChoiceBox;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        this.elevatorNumberChoiceBox.getItems().add(1);
        this.elevatorNumberChoiceBox.getItems().add(2);
        this.elevatorNumberChoiceBox.getItems().add(3);
        this.elevatorNumberChoiceBox.getItems().add(4);
        this.elevatorNumberChoiceBox.getItems().add(5);
    }

    @FXML
    public void onActionLaunchSimulation() throws IOException{
        int choice = this.elevatorNumberChoiceBox.getSelectionModel().getSelectedItem();
        for(int i = 0; i < choice; i++){
            FXMLLoader loader = new FXMLLoader(getClass().getResource("Simulation.fxml"));
            Parent root = loader.load();
            Stage stage = new Stage();
            stage.setResizable(false);
            stage.setScene(new Scene(root));
            stage.show();
            stage.setTitle(String.valueOf(choice-i));
        }
        this.stage.close();
    }

    public void setStage(Stage stage){
        this.stage = stage;
    }
}
