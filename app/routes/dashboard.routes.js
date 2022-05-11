const dashboard = require("../controllers/dashboard.controller.js");

module.exports = (app) => {
    var router = require("express").Router();

    router.get("/status_machine", dashboard.statusMachine);

    router.get("/status_machine_ng", dashboard.statusMachineNG);
    
    router.get("/status_machine_ok", dashboard.statusMachineOK);
    
    router.get("/status_machine_by_month_year", dashboard.statusMachineByMonthYear);
    
    router.get("/status_machine_by_ng", dashboard.statusMachineByNG);
    
    router.get("/parts_alert", dashboard.alertParts);

    router.get("/tools_alert", dashboard.alertTools);
    
    router.get("/total_problem_machine", dashboard.totalProblemMachine);

    router.get("/total_problem_machine_in_month", dashboard.totalProblemMachineInMonth);

    router.get("/problem_timediff", dashboard.findProblemDiffTime);

    router.get("/total_minutes_problem", dashboard.totalMinutesProblemMachine);

    app.use("/api/dashboard", router);
};
