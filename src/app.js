let express = require('express'),
    moment = require("moment-timezone"),
    {IncomingForm} = require('formidable'),
    SelfReloadJson = require("self-reload-json"),
    {renameSync, mkdirSync, existsSync, readdirSync, statSync} = require('fs'),
    config = `${__dirname}/config.json`,
    app = express(),
    path = require("path");

if(!existsSync(config)) throw new Error("You don't have the file config.json, please look an example at https://github.com/FreiikDev/ScreenshotEmbedder");
config = new SelfReloadJson(config);
defaultDomain = config.domains.filter(x => x.default);

if (defaultDomain <= 0) throw new Error("There's no default domain in the configuration file.");
defaultDomain = defaultDomain[0];
if (config.languages.length <= 0) throw new Error("There's no language(s) in the configuration file.");
if (config.languages.filter(x => x.locale && x.uploadedOn && x.uploadedAt && x.uploadedBy).length < config.languages.length) throw new Error("Language configuration is invalid.");
if (!defaultDomain.language || !config.languages.find(x => x.locale === defaultDomain.language)) throw new Error("Default domain configuration is invalid.");
if (config.users.filter(x => x.username && x.key && x.activated && Array.isArray(x.domains) && !isNaN(x.size)).length < config.users.length) throw new Error("User configuration is invalid.");
if(!existsSync(`${__dirname}/medias/`)) mkdirSync(`${__dirname}/medias/`);
config.users.forEach(u => existsSync(`${__dirname}/medias/${u.username}`) ? null : mkdirSync(`${__dirname}/medias/${u.username}`))
app.listen(config.port, () => Logger.info(`ScreenshotEmbbedder listening on port ${config.port}`));

app.set('view engine', "ejs")
    .set('views', path.join(__dirname, '/views'))
    .use("/medias", express.static(__dirname + '/medias'))
    .use(express.static(__dirname + '/public'))
    .get('/*', async (req, res) => {
        let file = req.params[0];
        let user;
        let user_notified = config.users.filter(x => req.params[0].split("/")[0] === x.username).length >= 1;
        if(req.params[0].split("/")[0] === "medias" && existsSync(`${__dirname}/medias/${req.params[0]}`))  res.render(`${__dirname}/medias/${req.params[0]}`)
        if (!existsSync(`${__dirname}/medias/${req.params[0]}`) || user_notified) {
            const found = await readdirSync(`${__dirname}/medias/`, {withFileTypes: true})
                .filter(dirent => dirent.isDirectory())
                .filter(x => existsSync(`${__dirname}/medias/${x.name}/${req.params[0]}`) ? `${x.name}/${req.params[0]}` : null);
            if (!found[0] || user_notified) return res.status(404).send(config.error);
            user = found[0].name;
        }
        if(user && !user.domains.includes(req.hostname)) return res.status(404).send(config.error);
        const {birthtime, size} = statSync(`${__dirname}/medias/${(user ? `${user}/` : "") + file}`);
        let domain = config.domains.filter(x => x.hostname).filter(x => req.headers.host === x.hostname);

        if (domain.length <= 0) domain = defaultDomain;
        else domain = domain[0];
        let language = config.languages.filter(x => x.locale === domain.language)[0];
        if (language.length <= 0) language = config.languages.filter(x => x.locale === defaultDomain.language)[0];
        const date = moment.tz(birthtime, config.timezone).format(`MM/DD/YYYY HH:mm:ss`).split(" ");
        return res.render('./index.ejs', {
            color: domain.color ? domain.color : defaultDomain.color ? defaultDomain.color : "#000000",
            nameWeb: domain.nameWeb ? domain.nameWeb : defaultDomain.nameWeb ? defaultDomain.nameWeb : "ScreenshotEmbedder",
            name: file,
            user: user ? user : null,
            icon: domain.icon ? domain.icon : defaultDomain.icon ? defaultDomain.icon : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            link: `http://${req.headers.host}/medias/${user ? `${user}/` : ""}${file}`,
            created: date[1] ? `${language.uploadedOn} ${date[0]} ${user ? `${language.uploadedBy} ${user}, ` : ""}${language.uploadedAt} ${date[1]}` : "",
            size: getFileSize(size),
        });
    })

app.post('/upload', async (req, res) => {
    if (!req.headers.apikey || !config.users.filter(x => x.key === req.headers.apikey).size < 1) return res.status(403).send("The provided api key is invalid.")
    var form = new IncomingForm({
        multiples: false,
        uploadDir: `${__dirname}/medias/`
    });

    const user = config.users.filter(x => x.key === req.headers.apikey)[0];
    if (!user.activated) return res.status(403).send("Your account is disabled by the administrator.");
    if(user.domains[0] !== "all" || user.domains.includes(req.hostname)) return res.status(403).send("Your account don't have access to this domain, please contact your administrator.");
    let name;
    form.maxFileSize = user.size * 1024 * 1024;


    form.on('file', function (field, file) {
        name = file.name;
        renameSync(file.path, path.join(form.uploadDir, config.users.filter(x => x.key === req.headers.apikey)[0].username, name));
    })
        .on('end', function () {
            res.status(200).send({link: `https://${req.hostname}/${name}`})
        })
        .on('error', () => res.status(500))
        .parse(req);
});

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