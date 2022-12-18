export class Server {
    public suite: string = "";
    public hostName: string = "";
    public epoch: string = "";
    public lastUpdate: string = "";
    public status: string = "red";
    public uptime: string = "0.000";
    public icon: string = "";

    constructor(hostName: string, suite:string,  icon:string, epoch:string, lastUpdate:string, upTime:string, status:string) {
        
        this.hostName = hostName;
        this.suite = suite;
        this.icon = icon;
        this.epoch = epoch;
        this.lastUpdate = lastUpdate;
        this.uptime = upTime;
        this.status = status;
        //this.logServerModule();
    }
    

    logServerModule() {
        console.log("--------- Server Module Log Server ---------");
        console.log (
            "hostName " + this.hostName + 
            " suite " + this.suite + 
            " icon " + this.icon + 
            " epoch " + this.epoch +
            " lastUpdate " + this.lastUpdate + 
            " uptime "+ this.uptime + 
            " status "+ this.status);
    }

    // constructor() {

    // }
}