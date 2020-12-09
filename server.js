const app = require('./index')
const { server } = require('./config/index')

app.listen(process.env.PORT || server.port, (err) => {
    if (err) {
        console.log(err)
        process.exit(1)
    }

    console.log(`Server running on port ${server.port}`)
})