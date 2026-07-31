import Sequelize from "sequelize";

const conn = new Sequelize("JES", "root", "123456789", {
    dialect: "mysql",
    host: "localhost",
})

export default conn;