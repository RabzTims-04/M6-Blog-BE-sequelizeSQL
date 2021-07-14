import s from "sequelize"

const { Sequelize } = s
const { PGHOST, PGPASSWORD, PGUSER, PGPORT, PGDATABASE } = process.env

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: PGPORT,
    dialect: "postgres"
})

sequelize
    .authenticate()
        .then(() => {
            console.log("DB is authenticated");
            })
            .catch((err) => {
                console.log(err)
            })

export default sequelize