const express = require("express"),
    moment = require("moment-timezone"),
    {IncomingForm} = require("formidable"),
    SelfReloadJson = require("self-reload-json"),
    {appendFile, renameSync, mkdirSync, existsSync, readdirSync, statSync} = require("fs"),
    {I18n} = require("i18n"),
    {join} = require("path"),
    app = express(),
    i18n = new I18n({
        directory: join(__dirname, "locales")
    });

let config = join(__dirname, "config.json");
if (!existsSync(config)) throw new Error("You don't have the file config.json, please look an example at https://github.com/FreiikDev/UploadIntegration");
config = new SelfReloadJson(config);
let defaultDomain = config.domains.filter((e => e.default));
if (defaultDomain <= 0) throw new Error("There's no default domain in the configuration file.");
if (defaultDomain = defaultDomain[0], !defaultDomain.language || !i18n.getLocales().includes(defaultDomain.language)) throw new Error("Default domain configuration is invalid.");
if (config.users.filter((e => e.username && e.key && e.activated && Array.isArray(e.domains) && !isNaN(e.size))).length < config.users.length) throw new Error("User configuration is invalid.");


const Logger = (e, n) => {
    const z = `[${moment(Date.now()).format("HH:mm:ss")}] [${e.toUpperCase()}] ${n}`;
    if(config.logging) if(config.logging.enabled && config.logging.file) if(config.logging.enabled) appendFile(config.logging.file,`${z}\n`, () => {})
    console.log(z);
}, domainSettings = (e) => {
    let n = config.domains.filter((e => e.hostname)).filter((n => e.hostname === n.hostname));
    return n = n.length <= 0 ? defaultDomain : n[0], i18n.getLocales().includes(n.language) ? e.setLocale(n.language) : e.setLocale("en"), n
}, error = (d, r, t, e) => {
    d = domainSettings(r);
    return r.status(t).render("./error.ejs", {
        error: {
            code: t,
            status: r.__(e)
        },
        color: d.color ? d.color : "#000000",
        icon: d.icon ? d.icon : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        language: r.getLocale(),
        nameWeb: d.name
    })
}

existsSync(join(__dirname, "medias") || mkdirSync(join(__dirname, "medias")), config.users.forEach((e => existsSync(join(__dirname, "medias", e.username)) ? null : mkdirSync(join(__dirname, "medias", e.username)))), app.listen(config.port, (() => Logger("info", `UploadIntegration listening on port ${config.port}`))), app.set("view engine", "ejs").set("views", join(__dirname, "/views")).use("/medias", express.static(join(__dirname, "medias"))).use(express.static(join(__dirname, "/public"))).use(i18n.init).get("/*", (async (e, n) => {
    const a = domainSettings(e);
    if ("medias" === e.params[0].split("/")[0] || 0 === e.params[0].length) return error(e.hostname, n, 404, "error.404");
    let i = null;
    const s = e.params[0],
        r = e.headers["x-forwarded-proto"];
    if (!existsSync(join(__dirname, "medias", e.params[0]))) {
        const a = readdirSync(join(__dirname, "medias"), {
            withFileTypes: !0
        }).filter((e => e.isDirectory())).filter((n => existsSync(`${__dirname}/medias/${n.name}/${e.params[0]}`) ? `${n.name}/${e.params[0]}` : null));
        if (!a[0]) return error(e.hostname, n, 404, "error.404");
        if (i = config.users.filter((e => a[0].name === e.username))[0], !i.domains.includes(e.hostname) && "all" !== i.domains[0] || !i) return error(e.hostname, n, 404, "error.404");
    }
    const {
            ctime: t,
            size: o
        } = statSync(`${__dirname}/medias/${(i ? `${i.username}/` : "") + s}`),
        m = Math.floor(Math.log(o) / Math.log(1024)),
        d = moment.tz(t, config.timezone).format(e.__("dateFormat")).split(" ");
    return n.render("./index.ejs", {
        color: a.color ? a.color : defaultDomain.color ? defaultDomain.color : "#000000",
        created: d[1] ? i ? e.__("createdAt.withUser", {
            user: i.username,
            days: d[0],
            hours: d[1]
        }) : e.__("createdAt.withoutUser", {days: d[0], hours: d[1]}) : "",
        downloadFile: e.__("downloadFile"),
        icon: a.icon ? a.icon : defaultDomain.icon ? defaultDomain.icon : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        link: `${r || "http"}://${e.headers.host}/medias/${i ? `${i.username}/` : ""}${s}`,
        language: e.getLocale(),
        name: s,
        nameWeb: a.nameWeb ? a.nameWeb : defaultDomain.nameWeb ? defaultDomain.nameWeb : "UploadIntegration",
        size: `${1 * (o / Math.pow(1024, m)).toFixed(2)} ${["B", "KB", "MB", "GB", "TB"][m]}`,
        user: i ? i.username : null
    })
}), app.post("/upload", (async (e, n) => {
    var a = new IncomingForm({
        multiples: !1,
        uploadDir: `${__dirname}/medias/`
    });
    const i = config.users.filter((n => n.key === e.headers.apikey))[0],
        s = e.headers["x-forwarded-proto"];
    return i.activated ? "all" === i.domains[0] || i.domains.includes(e.hostname) ? (0 === i.size ? a.maxFileSize = 5368709120 : a.maxFileSize = 1024 * i.size * 1024, void a.parse(e, ((r, t, o) => {
        if (r) return n.status(500).send("error.500");
        if (o.file) {
            const r = o.file.originalFilename;
            renameSync(o.file.filepath, join(a.uploadDir, i.username, r)), Logger("created", e.__("uploadedOn", {
                filename: r,
                hostname: e.hostname,
                user: i.username
            })), n.status(200).send({
                link: `${s || "http"}://${e.hostname}/${r}`
            })
        } else n.status(403).send(e.__("uploadNotAllowed"))
    }))) : n.status(403).send(e.__("restrictedDomainAccess")) : n.status(403).send(e.__("accountDisabled"))
}))));