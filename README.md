# Upload Integration (v4) 📷

This Node.js project serves as an upload integration system, allowing users to share files on Discord (using embed) and websites. Below are step-by-step instructions on how to set up and use this project.

## 📝 Instructions

1. **Configuration:**
   - Edit the configuration file located at `src/config.json` using the provided example file at `src/example.json`.

2. **Install Packages:**
   - Open your terminal and run `npm install` to install the required packages.

3. **Run the Project:**
   - Start the project by running `npm start` in the terminal.

## 🖼️ Examples

### Discord Integration

![Example 1](https://i.volt.science/medias/Adam/INDId.png)

### Website Integration

![Example 2](https://i.volt.science/medias/Adam/8JgIx.png)

## 🚀 Usage

### Configuration of separated profiles

1. Run `npm run generate` and follow the instructions.

   ![Example Generate](https://i.volt.science/medias/Adam/po0hu.gif)

2. For ShareX users:
   - Import the generated file (in .SXCU) by double-clicking on the file.

3. ShareX & Configured Account:
   - Configure as a custom uploader in ShareX with specific settings.

   ![Example Share X](https://i.volt.science/medias/Adam/DQdBR.png)

4. SFTP/FTP Server Configuration:
   - Remote directory: `UploadIntegration/src/medias/(your_username or nothing)`
   - URL path: `(http/https)://your_hostname/`
   - Uncheck *"Append remote directory to URL path"*

   _Note: If you have another uploader, place files in `UploadIntegration/src/medias/(your_username or nothing)`._

## 📚 Dependencies

- [EJS](https://npmjs.org/ejs)
- [ExpressJS](https://npmjs.org/express)
- [Formidable](https://npmjs.org/formidable)
- [FS](https://www.npmjs.com/package/fs)
- [i18n](https://www.npmjs.com/package/i18n)
- [Moment-Timezone](https://npmjs.org/moment-timezone)
- [Path](https://www.npmjs.com/package/path)
- [Readline](https://www.npmjs.com/package/readline)

_Font of the website: PT Sans [Google Fonts](https://fonts.google.com/specimen/PT+Sans)_

Project protected with MIT license. Base realized by [D0wzy](https://github.com/D0wzy), modified & rewritten by [FreiikDev](https://github.com/FreiikDev).
