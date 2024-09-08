export class Server {
    public type: string = "";
    public hostName: string = "";
    public epoch: string = "";
    public lastUpdate: string = "";
    public status: string = "red";
    public uptime: string = "0.000";
    public icon: string = "";

    constructor(hostName: string, type:string,  icon:string, epoch:string, lastUpdate:string, upTime:string, status:string) {
        
        this.hostName = hostName;
        this.type = type;
        this.icon = icon;
        this.epoch = epoch;
        this.lastUpdate = lastUpdate;
        this.uptime = upTime;
        this.status = status;
        //this.logServerModule();
    }

    setIcon(icon:string) {
        this.icon = icon;
    }

    

    logServerModule() {
        console.log("--------- Server Module Log Server ---------");
        console.log (
            "hostName " + this.hostName + 
            " type " + this.type + 
            " icon " + this.icon + 
            " epoch " + this.epoch +
            " lastUpdate " + this.lastUpdate + 
            " uptime "+ this.uptime + 
            " status "+ this.status);
    }

    // constructor() {

    // }
}