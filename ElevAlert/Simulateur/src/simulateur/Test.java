package simulateur;

import javafx.collections.ObservableList;
import javafx.scene.control.Button;
import javafx.scene.control.TableView;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;

public class Test {

    private final ObservableList<Component> listComponent;

    private BackgroundTask backgroundTask;

    private Text textTest;

    private Button repareButton;

    private TableView<Component> tableView;
    
    private Request resquest;

    public Test(ObservableList<Component> listComponent) {
        System.out.println("Instance de test");
        this.listComponent = listComponent;
    }

    public void setBackgroundTask(BackgroundTask backgroundTask){
        this.backgroundTask = backgroundTask;
    }

    public void setTextTest(Text textTest){
        this.textTest = textTest;
    }

    public void setTableView(TableView<Component> tableView){
        this.tableView = tableView;
    }

    public void setRepareButton(Button repareButton) {
        this.repareButton = repareButton;
    }

    public boolean checkErrorDurability(){
        for(var i : this.listComponent){
            if(i.getDurability() <= 0){
                i.setStatus(false);
                this.backgroundTask.cancel();
                this.textTest.setText("A component is breakdown");
                this.textTest.setFill(Color.RED);
                this.backgroundTask.getElevatorAnimation().getRectangle().setFill(Color.RED);
                this.repareButton.setDisable(false);
                return true;
            }
        }
        return false;
    }

    public void generateBreakdown(){
        int index = ElevatorAnimation.randomNumber(0, this.listComponent.size() - 1);
        Component component = this.listComponent.get(index);
        int currentDurability = component.getDurability();
        int result = currentDurability - ElevatorAnimation.randomNumber(0,30);
        if(!this.checkErrorDurability()) {
        	if(currentDurability > 0){
	            if(result < 0){
	                component.setDurability(0);
	                this.resquest.putRequest(component.getIdComponent());
	            }
	            else
	                component.setDurability(result);
	            this.tableView.refresh();
	        }
        }

    }

    public void repareComponent(Component component){
        if(component.getDurability() == 0){
            component.setDurability(100);
            this.resquest.postRequest(component.getIdComponent());
            this.backgroundTask.getElevatorAnimation().getRectangle().setFill(Color.GREY);
            
            if(!this.checkErrorDurability()){
                this.tableView.refresh();
            }
        }

    }
    
    public void setRequest(Request request) {
    	this.resquest = request;
    }

}
