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

    router.get("/problem_machine_trending", dashboard.MachineTroubleTrending);
    
    router.get(
      "/downtime_problem_machine_this_month",
      dashboard.DownTimeProblemMachineThisMonth
    );

    router.get(
      "/top_five_machine_problem",
      dashboard.TopFiveMachineProblem
    );

    router.get("/total_machine_check_status", dashboard.TotalMachineCheck);

    app.use("/api/dashboard", router);
};
