# 📰 Instructions

- Configure the configuration file (`src/config.json`) using `src/example.json`
- Install packages (`npm install` in the terminal)
- Run it ! `npm start`

# 🔎 Examples

### On Discord

<img alt="Example 1" src="https://i.volt.science/medias/Adam/INDId.png" target="_blank" />

### On website

<img alt="Example 2" src="https://i.volt.science/medias/Adam/8JgIx.png" target="_blank" />

# How we can use it?

### You can configure a system with separated "account".

#### For that, run `npm run generate` and follow instructions.

<img alt="Example generate" src="https://i.volt.science/medias/Adam/po0hu.gif" target="_blank" />

#### If you use ShareX, import the generated file (in .SXCU) just by double clicking on the file.

### If you want use ShareX & an account configurated, configure as a custom uploader like this:

- Click to new and choose your name
- Your request URL is (http/https)://your_hostname/upload as POST method
- You need to write `file` under "File from name:"
- In headers, please write apikey as name and write the key in the value section
- Into URL, you can write `$json:link$`
  <img alt="Example Share X" src="https://i.volt.science/medias/Adam/DQdBR.png" target="_blank" />

### Also, you can make another configuration as a SFTP/FTP server:

- Remote directory: `UploadIntegration/src/medias/(your_username or nothing)`
- URL path: `(http/https)://your_hostname/`
- Uncheck *"Append remote directory to URL path"*

#### PS: if you have another uploader, you can put files in `UploadIntegration/src/medias/(your_username or nothing)`.

# 📙 Dependencies

- EJS (https://npmjs.org/ejs)
- ExpressJS (https://npmjs.org/express)
- Formidable (https://npmjs.org/formidable)
- FS (https://www.npmjs.com/package/fs)
- i18n (https://www.npmjs.com/package/i18n)
- Moment-Timezone (https://npmjs.org/moment-timezone)
- Path (https://www.npmjs.com/package/path)
- Readline (https://www.npmjs.com/package/readline)
- Font of the website : PT Sans (https://fonts.google.com/specimen/PT+Sans)

Project protected with MIT licence. Base realized by [D0wzy](https://github.com/D0wzy), modified & rewrited by
me (https://github.com/FreiikDev).
