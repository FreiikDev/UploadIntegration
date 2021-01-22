/* Modules */
const express = require('express')
const moment = require("moment-timezone");
const fs = require('fs')

const config = require('./config.json')
const app = express();
const port = config.app.port

app.listen(port, async () => {
    Logger.info(`App listening on port ${port}`)
})

app.set('view engine', 'ejs');;
app.use("/medias", express.static('medias'));

app.get('/:id', async (req, res) => {
    if (!fs.existsSync(`./medias/${req.params.id}`)) return res.status(404).send("cc")

    const { birthtime, size } = fs.statSync(`./medias/${req.params.id}`);
    const createdAt = `${moment.tz(birthtime, "Europe/Paris").format("DD/MM/YYYY")} at ${moment.tz(birthtime, "Europe/Paris").format("HH:mm:ss")}`

    function getFileSize(size) {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
    }

    res.render('./index.ejs', {
        name: req.params.id,
        link: config.app.host + `medias/${req.params.id}`,
        createdAt,
        size: getFileSize(size),
        show: async () => {
            res.redirect(config.app.host + `medias/${req.params.id}`)
        }
    })
})


/*LOGGER*/
function Logger(type, text) {
    const time = moment(Date.now()).format("HH:mm:ss")
    console.log(`[${time}] [${type.toUpperCase()}] ${text}`)
}

Logger.info = async (text) => {
    Logger('info', text)
}
