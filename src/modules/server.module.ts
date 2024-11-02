export class Server {
    public checksum: string = "";
    public cpuinfo: any = [];
    public disks:any = [];
    public epoch: string = "";
    public groups:any = [];
    public hostname: string = "";
    public icon: string = "";
    public lastUpdate: string = "";
    public local: string = ""; 
    public logavail: string = ""; 
    public logpercent: string = ""; 
    public logtotal: string = "";
    public logused: string = "";
    public memory:any = {}; 
    public nodemanagers:any =[];
    public opsavail: string = ""; 
    public opspercent: string = ""; 
    public opstotal: string = "";
    public opsused: string = ""; 
    public os: string = "";
    public osversion: string = "";
    public processinfo:any [];
    public status: string = "red";
    public subagent:any =[];
    public tmpavail: string = ""; 
    public tmppercent: string = "";
    public tmptotal: string = "";
    public tmpused: string = "";
    public type: string = ""; 
    public uptime: string = "0.000";

    /*(
        checksun "",
        disks [],
        epoch "",
        groups [],
        hostname "",
        icon "",
        lastUpdate "",
        local "",
        logavail "",
        logpercent "",
        logtotal "",
        logused "",
        memory {},
        nodemanagers [],
        opsavail "",
        opspercent "",
        opstotal "",
        opsused "",
        os "",
        osversion "",
        status "",
        subagent [],
        tmpavail "",
        tmppercent "",
        tmptotal "",
        tmpused "",
        type "",
        uptime "",
    )*/

    constructor(checksum:string, cpuinfo:any, disks:any, epoch:string, groups:any, hostname: string, icon:string, lastUpdate:string, local: string, logavail: string, logpercent: string, logtotal: string, 
        logused: string, memory:any, nodemanagers:any, opsavail: string, opspercent: string, opstotal: string, opsused: string, os: string, osversion: string, processinfo:any, status: string, subagent:any, 
        tmpavail: string, tmppercent: string, tmptotal:string, tmpused: string, type:string, uptime:string) {
        
        this.checksum     = checksum;
        this.cpuinfo     = cpuinfo;
        this.disks        = disks;
        this.epoch        = epoch;
        this.groups       = groups;
        this.hostname     = hostname;
        this.icon         = icon;
        this.lastUpdate   = lastUpdate;
        this.local        = local; 
        this.logavail     = logavail; 
        this.logpercent   = logpercent; 
        this.logtotal     = logtotal;
        this.logused      = logused;
        this.memory       = memory; 
        this.nodemanagers = nodemanagers;
        this.opsavail     = opsavail ; 
        this.opspercent   = opspercent; 
        this.opstotal     = opstotal;
        this.opsused      = opsused; 
        this.os           = os;
        this.osversion    = osversion;
        this.processinfo  = processinfo;
        this.status       = status;
        this.subagent     = subagent;
        this.tmpavail     = tmpavail; 
        this.tmppercent   = tmppercent;
        this.tmptotal     = tmptotal;
        this.tmpused      = tmpused;
        this.type         = type; 
        this.uptime      = uptime;

        //this.logServerModule();
    }

    sethostname(hostname:string) {
        this.hostname = hostname;
    }

    setIcon(icon:string) {
        this.icon = icon;
    }

    setstatus(status:string) {
        this.status = status;
    }

    logServerModule() {
        console.log("--------- Server Module Log Server ---------");
        console.log (
            "hostname " + this.hostname + 
            " type " + this.type + 
            " icon " + this.icon + 
            " epoch " + this.epoch +
            " lastUpdate " + this.lastUpdate + 
            " uptime "+ this.uptime + 
            " status "+ this.status);
    }
}