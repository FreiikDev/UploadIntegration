let express = require('express'),
    moment = require("moment-timezone"),
    {existsSync, statSync} = require('fs'),
    config = require("./config.json"),
    app = express(),
    path = require("path"),
    defaultDomain = config.domains.filter(x => x.default);

if(defaultDomain <= 0) throw new Error("There's no default domain in the configuration file.");
defaultDomain = defaultDomain[0];
if(config.languages.length <= 0) throw new Error("There's no language(s) in the configuration file.");
if(config.languages.filter(x => x.locale && x.uploadedOn && x.uploadedAt).length < config.languages.length) throw new Error("Language configuration is invalid.");
if(!defaultDomain.language || !config.languages.find(x => x.locale === defaultDomain.language)) throw new Error("Default domain configuration is invalid.");

app.listen(config.port, async () => {
    Logger.info(`ScreenshotEmbbedder listening on port ${config.port}`);
});

app.set('view engine', "ejs")
    .set('views', path.join(__dirname, '/views'))
    .use("/medias", express.static(__dirname + '/medias'))
    .use(express.static(__dirname + '/public'))
    .get('/:id', async (req, res) => {

        if (!existsSync(`./src/medias/${req.params.id}`)) return res.status(404).send(config.error)

        const {birthtime, size} = statSync(`./src/medias/${req.params.id}`);
        let domain = config.domains.filter(x => x.hostname).filter(x => req.headers.host === x.hostname);

        if (domain.length <= 0) domain = defaultDomain;
        else domain = domain[0];

        let language = config.languages.filter(x => x.locale === domain.language)[0];
        if (language.length <= 0) language = config.languages.filter(x => x.locale === defaultDomain.language)[0];
        const date = moment.tz(birthtime, config.timezone).format(`MM/DD/YYYY HH:mm:ss`).split(" ");

        return res.render('./index.ejs', {
            color: domain.color ? domain.color : defaultDomain.color ? defaultDomain.color : "#000000",
            nameWeb: domain.nameWeb ? domain.nameWeb : defaultDomain.nameWeb ? defaultDomain.nameWeb : "ScreenshotEmbedder",
            name: req.params.id,
            icon: domain.icon ? domain.icon : defaultDomain.icon ? defaultDomain.icon : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            link: "http://" + req.headers.host + `/medias/${req.params.id}`,
            created: date[1] ? `${language.uploadedOn} ${date[0]} ${language.uploadedAt} ${date[1]}` : "",
            size: getFileSize(size),
        });
    })

Logger.info = async (text) => {
    Logger('info', text)
}

function getFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

function Logger(type, text) {
    const time = moment(Date.now()).format("HH:mm:ss")
    console.log(`[${time}] [${type.toUpperCase()}] ${text}`)
}