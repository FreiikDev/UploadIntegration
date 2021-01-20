/* Modules */
const express = require('express')
const moment = require('moment')
const fs = require('fs')

const config = require('./config.json')
const app = express()
const port = 31337

app.listen(port, async() => {
    Logger.info(`App listening on port ${port}`)
})

app.set('view engine', 'ejs');
app.use(express.static('medias'));


app.use((req, res) => {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Credentials', true);
});

app.get('/m/:id', async(req, res) => {
    console.log(req.params.id)

    if (!fs.existsSync(`./medias/${req.params.id}`)) return res.status(200).send({
        error: "Unknow id"
    })

    const { birthtime } = fs.statSync(`./medias/${req.params.id}`);

    const createdAt = moment(Date.parse(birthtime).getTIme()).format("YYYY/MM/DD") + "at" + moment(Date.parse(birthtime).getTIme()).format("HH:mm:ss")
    res.render('./index.html', {
        name: req.params.id,
        link: config.app.host + `m/${id}`,
        createdAt
    })
})


/*LOGGER*/
function Logger(type, text) {
    const time = moment(Date.now()).format("HH:mm:ss")
    console.log(`[${time}] [${type.toUpperCase()}] ${text}`)
}

Logger.info = async(text) => {
    Logger('info', text)
}
