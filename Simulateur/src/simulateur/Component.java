package simulateur;

public class Component {
    private int idComponent;
    private int idElevator;
    private int idError;
    private String nom;
    private int durability;
    private boolean status;

    public Component(int idComponent, int idElevator, int idError, String nom, boolean status) {
        this.idComponent = idComponent;
        this.idElevator = idElevator;
        this.idError = idError;
        this.nom = nom;
        this.status = status;
        //Assigning a value the durability
        if(this.status)
            this.durability = 100;
        else
            this.durability = 0;
    }
    
    public Component() {
    	
    }

    public int getIdComponent() {
        return idComponent;
    }

    public int getIdElevator() {
        return idElevator;
    }

    public int getIdError() {
        return idError;
    }

    public String getNom() {
        return nom;
    }

    public int getDurability() {
        return durability;
    }

    public void setDurability(int durability){
        this.durability = durability;
    }

    public boolean getStatus() {
        return status;
    }

    public  void setStatus(boolean status){
        this.status =  status;
    }

    

    public void setIdError(int idError) {
		this.idError = idError;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	@Override
    public String toString(){
        return "idComponent " + this.idComponent + " idElevator " + this.idElevator + " idError " + this.idError + " name " + this.nom
                + " durability " + this.durability + " status " + this.status;
    }

}
