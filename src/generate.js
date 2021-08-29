let readline = require("readline"),
    {randomBytes} = require("crypto"),
    {existsSync, writeFileSync, mkdirSync} = require('fs'),
    {join} = require("path"),
    config = `${__dirname}/config.json`,
    username,
    domains,
    size,
    question = (question, err) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => {
            clear(err ? err : null);
            rl.question(question + " ", answer => {
                rl.close();
                return resolve(answer);
            });
        });
    };

if (!existsSync(config)) throw new Error("You don't have the file config.json, please look an example at https://github.com/FreiikDev/ScreenshotEmbedder");
config = new require(config);
let defaultDomain = config.domains.filter(x => x.default);
if (defaultDomain <= 0) throw new Error("There's no default domain in the configuration file.");
defaultDomain = defaultDomain[0];
if (config.users.filter(x => x.username && x.key && x.activated && Array.isArray(x.domains)).length < config.users.length) throw new Error("User configuration is invalid.");

async function main(error) {
    let r = await question("What is your username ?", error)
    if (!r || config.users.filter(x => x.username.toLowerCase() === r.toLowerCase()) === true) return main("The user aleardy exists in the configuration file.")
    username = r;
    return getUserDomains();
}

async function getUserDomains(error) {
    let r = await question("What are the authorized domains for this user? Type \"all\" to grant all domains, or separate by a comma. ", error)
    r = r.replace(/ /g, "").split(",");
    if (r[0] !== "all" && r.filter(x => /((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(x)).length < r.length) return getUserDomains("A invalid domains list has been provided, please retry.")
    domains = r;
    return getMaxFilesSize();
}

async function getMaxFilesSize() {
    let r = await question("What is the maximum size of a file that this user can upload ? Type \"0\" for unlimited size. (Example : 1 equal to 1MB). ")
    if (r || !isNaN(r)) {
        size = Number(r);
        return end();
    }
    return getMaxFilesSize();
}

function end() {

    let key = randomBytes(64).toString('hex');
    config.users.push({username, key, domains, "activated": true, size})
    const path = join(__dirname, `/accounts/${username}-config.sxcu`)
    if (!existsSync(`${__dirname}/accounts/`)) mkdirSync(`${__dirname}/accounts/`);
    if (!existsSync(`${__dirname}/medias/`)) mkdirSync(`${__dirname}/medias/`);
    try {
        if (!existsSync(`${__dirname}/medias/${username}`)) mkdirSync(`${__dirname}/medias/${username}`);
        writeFileSync(`${__dirname}/config.json`, JSON.stringify(config, null, 3));
        writeFileSync(`${path}`, JSON.stringify({
            "Name": "ScreenshotEmbedder by D0wzy & Freiik",
            "DestinationType": "ImageUploader",
            "RequestMethod": "POST",
            "RequestURL": `https://${domains[0] === "all" ? defaultDomain.hostname : domains[0]}/upload/`,
            "Headers": {
                "apikey": key
            },
            "Body": "MultipartFormData",
            "FileFormName": "file",
            "URL": "$json:link$"
        }, null, 3));
        console.log(`The ShareX configuration is generated ! Check in ${path}`)
    } catch (e) {
        console.log(`Error when writing the ShareX configuration at ${path}:` + e.message)
    }
    console.log(`
There is your configuration !
-----------------------
Username: ${username}
API Key: ${key}
Endpoint: https://${domains[0] === "all" ? defaultDomain.hostname : domains[0]}/upload/
-----------------------`)
    process.exit(0);
}

function clear(error) {
    process.stdout.write('\033[2J');
    process.stdout.write('\u001b[H\u001b[2J\u001b[3J');
    if (error) console.log(error);
}

main();
