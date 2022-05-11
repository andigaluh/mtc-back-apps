const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        port: config.PORT,
        dialect: config.dialect,
        operatorsAliases: false,
        timezone:'+07:00',
        logging: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model.js")(
  sequelize,
  Sequelize
);
db.doc_inspection = require("./doc_inspection.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.job = require("./job.model.js")(sequelize, Sequelize);
db.job_class = require("./job_class.model.js")(sequelize, Sequelize);
db.org = require("./org.model.js")(sequelize, Sequelize);
db.org_class = require("./org_class.model.js")(sequelize, Sequelize);
db.shift = require("./shift.model.js")(sequelize, Sequelize);
db.tools_type = require("./tools_type.model.js")(sequelize, Sequelize);
db.tools = require("./tools.model.js")(sequelize, Sequelize);
db.tools_adjustment = require("./tools_adjustment.model.js")(sequelize, Sequelize);
db.tools_adjustment_item = require("./tools_adjustment_item.model.js")(sequelize, Sequelize);
db.tools_excel = require("./tools_excel.model.js")(sequelize, Sequelize);
db.parts = require("./parts.model.js")(sequelize, Sequelize);
db.parts_excel = require("./parts_excel.model.js")(sequelize, Sequelize);
db.parts_adjustment = require("./parts_adjustment.model.js")(sequelize, Sequelize);
db.parts_adjusment_item = require("./parts_adjustment_item.model.js")(sequelize, Sequelize);
db.menu = require("./menu.model.js")(sequelize, Sequelize);
db.machine = require("./machine.model.js")(sequelize, Sequelize);
db.machine_parts = require("./machine_parts.model.js")(sequelize, Sequelize);
db.machine_check = require("./machine_check.model.js")(sequelize, Sequelize);
db.machine_check_condition = require("./machine_check_condition.model.js")(sequelize, Sequelize);
db.machine_check_problem = require("./machine_check_problem.model.js")(sequelize, Sequelize);
db.machine_check_need_parts = require("./machine_check_need_parts.model.js")(sequelize, Sequelize);
db.machine_check_approval = require("./machine_check_approval.model.js")(sequelize, Sequelize);
db.notif = require("./notif.model.js")(sequelize, Sequelize);
db.report_machine_check = require("./report_machine_check.model.js")(sequelize, Sequelize);
db.schedule_mtc = require("./schedule_mtc.model.js")(sequelize, Sequelize);
db.problem_machine = require("./problem_machine.model.js")(sequelize, Sequelize);
db.schedule_mtc_excel = require("./schedule_mtc_excel.model.js")(sequelize, Sequelize);
db.equipment = require("./equipment.model.js")(sequelize, Sequelize);
db.equipment_excel = require("./equipment_excel.model.js")(sequelize, Sequelize);

db.machine_check.belongsToMany(db.user, {
  through: "machine_check_approval",
  foreignKey: "machine_check_id",
  otherKey: "userId",
});

db.user.belongsToMany(db.machine_check, {
  through: "machine_check_approval",
  foreignKey: "userId",
  otherKey: "machine_check_id",
}); 

db.machine_check_approval.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.machine.belongsToMany(db.parts, {
  through: "machine_parts",
  foreignKey: "machine_id",
  otherKey: "parts_id",
});
db.parts.belongsToMany(db.machine, {
  through: "machine_parts",
  foreignKey: "parts_id",
  otherKey: "machine_id",
});

db.job.belongsTo(db.job_class, { foreignKey: "job_class_id", as: "job_class" });
db.job.belongsTo(db.org, { foreignKey: "org_id", as: "org" });
db.job_class.belongsTo(db.job_class, {
  foreignKey: "upper_job_class_id",
  as: "upper_job_class",
});
db.org.belongsTo(db.org_class, { foreignKey: "org_class_id", as : "org_class" });
db.tools.belongsTo(db.tools_type, { foreignKey: "tools_type_id" });
db.machine_check.belongsTo(db.machine, { foreignKey: "machine_id" });
db.machine_check.belongsTo(db.shift, { foreignKey: "shift_id" });
db.machine_check.belongsTo(db.user, { foreignKey: "inspection_id" });
db.machine_check.belongsTo(db.user, { foreignKey: "supervisor_id" });
db.machine_check_problem.belongsTo(db.machine_check, { foreignKey: "machine_check_id" });
db.user.belongsTo(db.job, { foreignKey: "job_id" });
db.notif.belongsTo(db.user, { foreignKey: "user_id" });
db.parts_adjusment_item.belongsTo(db.parts, { foreignKey: "parts_id" });
db.tools_adjustment_item.belongsTo(db.tools, { foreignKey: "tools_id", as: "tools"});
db.tools_adjustment_item.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});
db.machine_check_condition.belongsTo(db.parts, {
  foreignKey: "parts_id",
  as: "parts"
});
db.machine_check_need_parts.belongsTo(db.parts, {
  foreignKey: "parts_id",
  as: "parts",
});
db.parts_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});
db.schedule_mtc_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});
db.tools_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});
db.schedule_mtc.belongsTo(db.machine, {
  foreignKey: "machine_id",
  as: "machine",
});
db.schedule_mtc.belongsTo(db.parts, {
  foreignKey: "parts_id",
  as: "parts",
});
db.schedule_mtc.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});
db.problem_machine.belongsTo(db.machine, {
  foreignKey: "machine_id",
  as: "machine",
});
db.problem_machine.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.problem_machine.belongsTo(db.parts, {
  foreignKey: "parts_id",
  as: "parts",
});

db.equipment_excel.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

/* db.tools.belongsToMany(db.tools_adjustment, {
    through: "tools_adjustment_item",
    foreignKey: "tools_id",
});

db.tools_adjustment.belongsToMany(db.tools, {
    through: "tools_adjustment_item",
    foreignKey: "tools_adjustment_id",
}); */

/* db.parts.belongsToMany(db.parts_adjustment, {
    through: "parts_adjustment_item",
    foreignKey: "parts_id",
}); */

/* db.parts_adjustment.belongsToMany(db.parts, {
    through: "parts_adjustment_item",
    foreignKey: "parts_adjustment_id",
}); */

db.menu.belongsToMany(db.user, {
    through: "user_menus",
    foreignKey: "menu_id",
    otherKey: "user_id",
});
db.user.belongsToMany(db.menu, {
    through: "user_menus",
    foreignKey: "user_id",
    otherKey: "menu_id",
});

db.machine_check.belongsToMany(db.parts, {
  through: "machine_check_condition",
  foreignKey: "machine_check_id",
});

db.parts.belongsToMany(db.machine_check, {
  through: "machine_check_condition",
  foreignKey: "parts_id",
});

db.machine_check.belongsToMany(db.parts, {
  through: "machine_check_need_parts",
  foreignKey: "machine_check_id",
});

db.parts.belongsToMany(db.machine_check, {
  through: "machine_check_need_parts",
  foreignKey: "parts_id",
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});

db.ROLES = ["operator", "admin", "supervisor", "engineer", "manager"];

module.exports = db;