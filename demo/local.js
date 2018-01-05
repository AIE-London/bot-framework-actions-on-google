require("dotenv").config();
const { exec } = require('child_process');
const ngrok = require('ngrok');
const fs = require('fs');

const actionMeta = Object.assign({}, require("./action.json"));
const app = require("./index.js");

ngrok.connect(process.env.PORT || 3000, (err, url) => {
  console.log("[NGROK] Obtained URL: " + url);
  // Write to actions metadata file
  actionMeta.conversations.MAIN_CONVERSATION.url = url;
  fs.writeFile("./action.json", JSON.stringify(actionMeta), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("[FS] Rewrote actions.json to update URL");
    // Update GACTIONS for local dev.
    exec(`gactions update --action_package action.json --project ${process.env.GACTIONS_PROJECT_ID}`, (err, stdout, stderr) => {
      if (err) {
        // Failed
        return console.error(err);
      }
      console.log("[GACTIONS] Successfully executed update via gactions CLI");
      // Done. Leave app running.
    });    
  }); 
});
