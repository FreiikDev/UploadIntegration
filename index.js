/* Modules */
const express = require('express')
const moment = require("moment-timezone");
const fs = require('fs')

const config = {
    app: {
        host: 'https://s.voltbot.xyz/',
        port: 80
    }
};

const app = express();
const port = config.app.port

app.listen(port, async () => {
    Logger.info(`App listening on port ${port}`)
})

app.set('view engine', 'ejs');;
app.use("/medias", express.static('medias'));

app.get('/:id', async (req, res) => {

    if (!fs.existsSync(`./medias/${req.params.id}`)) return res.status(404).send("Tu t'es perdu ? Rejoins le meilleur serveur français ! discord.gg/chillfr")

    const { birthtime, size } = fs.statSync(`./medias/${req.params.id}`);

    function getFileSize(size) {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
    }

    if (req.headers.host.includes("chillfr.com")) {
        res.render('./index.ejs', {
            color: "#90ff8a",
            nameWeb: "ChillFR — Capture",
            name: req.params.id,
            link: config.app.host + `medias/${req.params.id}`,
            created: "Téléversé le " + `${moment.tz(birthtime, "Europe/Paris").format("DD/MM/YYYY")} à ${moment.tz(birthtime, "Europe/Paris").format("HH:mm:ss")}`,
            size: getFileSize(size),
            show: async () => {
                res.redirect(config.app.host + `medias/${req.params.id}`)
            }
        })
        return;
    } else if (req.headers.host.includes("dowzy.fr")) {
        res.render('./index.ejs', {
            color: "#2F3136",
            nameWeb: "D0wzy — Capture d'écran",
            name: req.params.id,
            link: config.app.host + `medias/${req.params.id}`,
            created: "Téléversé le " + `${moment.tz(birthtime, "Europe/Paris").format("DD/MM/YYYY")} à ${moment.tz(birthtime, "Europe/Paris").format("HH:mm:ss")}`,
            size: getFileSize(size),
        })
        return;
    } else if (req.headers.host.includes("support-accountweb.fr")) {
        res.render('./index.ejs', {
            color: "#ffb330",
            nameWeb: "PayPal Official — Screenshot",
            name: req.params.id,
            link: config.app.host + `medias/${req.params.id}`,
            created: "Uploaded on " + `${moment.tz(birthtime, "Europe/Paris").format("MM/DD/YYYY")} at ${moment.tz(birthtime, "Europe/Paris").format("HH:mm:ss")}`,
            size: getFileSize(size),
        })
    }
    else {
        res.render('./index.ejs', {
            color: "#ffb330",
            nameWeb: "VoltBot — Screenshot",
            name: req.params.id,
            link: config.app.host + `medias/${req.params.id}`,
            created: "Uploaded on " + `${moment.tz(birthtime, "Europe/Paris").format("MM/DD/YYYY")} at ${moment.tz(birthtime, "Europe/Paris").format("HH:mm:ss")}`,
            size: getFileSize(size),
        })
    }
})


/*LOGGER*/
function Logger(type, text) {
    const time = moment(Date.now()).format("HH:mm:ss")
    console.log(`[${time}] [${type.toUpperCase()}] ${text}`)
}

Logger.info = async (text) => {
    Logger('info', text)
}
