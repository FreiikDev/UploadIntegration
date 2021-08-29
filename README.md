
# 📰 Instructions
- Configure the configuration file (`src/config.json`) using `src/example.json`
- Install packages (`npm install` in the CMD)
- Run it ! `npm start`

# 🔎 Examples
### On Discord
<img alt="Example 1" src="https://s.voltbot.xyz/medias/Adam/A5HI.png" target="_blank" />

### On website
<img alt="Example 2" src="https://s.voltbot.xyz/medias/Adam/msuI.png" target="_blank" />

# How we can use it?
### You can configure a system with separated "account".
#### For that, run `npm run generate` and follow instructions.
<img alt="Example generate" src="https://s.voltbot.xyz/medias/AG9X.gif" target="_blank" />

#### If you use ShareX, import the generated file (in .SXCU) in the custom uploader settings.
<img alt="Example ShareX Import" src="https://s.voltbot.xyz/medias/0T61.png" target="_blank" />

### If you want use ShareX & an account configurated, configure as a custom uploader like this:
- Click to new and choose your name
- Your request URL is (http/https)://your_hostname/upload as POST method
- You need to write `file` under "File from name:"
- In headers, please write apikey as name and write the key in the value section
- Into URL, you can write `$json:link$`
<img alt="Example Share X" src="https://s.voltbot.xyz/medias/Adam/2Nfq.png" target="_blank" />

### Also, you can make another configuration as a SFTP/FTP server:
- Remote directory: `ScreenshotEmbedder/src/medias/`
- URL path: `(http/https)://your_hostname/`
- Uncheck *"Append remote directory to URL path"*

#### PS: if you have another uploader, you can put files in `ScreenshotEmbedder/src/medias/`.  

# 📙 Dependencies
- Crypto (https://npmjs.org/crypto)
- EJS (https://npmjs.org/ejs)
- ExpressJS (https://npmjs.org/express)
- Formidable (https://npmjs.org/formidable)
- FS (https://www.npmjs.com/package/fs)
- Moment-Timezone (https://npmjs.org/moment-timezone)
- Path (https://www.npmjs.com/package/path)
- Font of the website : PT Sans (https://fonts.google.com/specimen/PT+Sans)

Project protected with MIT licence. Base realized by [D0wzy](https://github.com/D0wzy), modified & rewrited by me (https://github.com/FreiikDev).
