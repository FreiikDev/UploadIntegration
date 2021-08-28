
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
### If you want use ShareX, please configure as a custom uploader like this :
- Click to new and choose your name
- Your request URL is http/s://your_hostname/upload as POST method
- You need to write `file` under "File from name:"
- In headers, please write apikey as name and write the key in the value section
- Into URL, you can write `$json:link$`
<img alt="Example Share X" src="https://s.voltbot.xyz/medias/Adam/2Nfq.png" target="_blank" />

### Also, you can make another configuration as a SFTP/FTP server :
- Remote directory: `ScreenshotEmbedder/src/medias/`
- URL path: `(http/https)://your_hostname/`
- Uncheck *"Append remote directory to URL path"*

# 📙 Dependencies
- Font : PT Sans (https://fonts.google.com/specimen/PT+Sans)
- ExpressJS (https://npmjs.org/express)
- EJS (https://npmjs.org.ejs)
- Formidable (https://npmjs.org/formidable)
- Moment-Timezone (https://npmjs.org/moment-timezone)

Project protected with MIT licence. Base realized by [D0wzy](https://github.com/D0wzy), modified & rewrited by me (https://github.com/FreiikDev).
