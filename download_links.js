const axios = require('axios');
const fs = require('fs');
const path = require('path');

// List of file URLs
const fileUrls = [
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Abeasi_Kwasi_Web_Final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Abouleish_Transcript_Final_for_web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Belo-Osagie_Hakeem_web_transcript.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Bouchamaoui_Ouided.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Brozin_Robert_Web_Final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Chandaria_Manu_web%20transcript.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Coovadia_Cas.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Danso_Hubert_Web_Final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/El%20Tahri_Neveen%20-%20Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Enelamah_Okey.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Fuhr_Ian.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Gore_Adrian_final_transcript_web2.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Heikal_Transcript_final_for_web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Ibrahim_Mo_Web_Transcript.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Jaffer_Mohamed.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Johnson_Omobola_final_transcript_for_web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Khoza_Reuel%20-%20Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Maziya_Savannah_web_transcript.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Mojela-Serobe_Transcript_Final_for_Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Muraya_Eva_Web_Final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Mwangi_James_Web_Final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Newton-King_Nicky%20-%20Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Nxasana_Sizwe_Web_Final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Ogunlesi_Adenike%20-%20Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Okelo_Mary_webv4.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Okomo-Okello_Transcript_Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Opeke_Transcript_Final_for_Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Orji_Uche_transcript_for_web_final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Osibodu_Victor_Web_Final.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Ouali_Badreddine%20-%20Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Quaynor_web_transcript.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Sawiris_Naguib%20-%20Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Shah_Vimal%20-%20Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Amina%20Laraki%20Slaoui_Transcript%20for%20Web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Mostafa%20Terrab_transcript_for_web.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Peter_Vundla.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Wavamunno_Web_Transcript.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Wharton-Hood_Peter.pdf",
"http://www.hbs.edu/creating-emerging-markets/Documents/transcripts/Zinn_Shirley.pdf",



];

// Download each file
async function downloadFiles() {
  try {
    for (const url of fileUrls) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const fileName = path.basename(url);
      const filePath = path.join(__dirname, fileName); // Specify the full path
      fs.writeFileSync(filePath, response.data);
      console.log(`Downloaded: ${fileName}`);
    }
    console.log('All files downloaded successfully!');
  } catch (error) {
    console.error('Error downloading files:', error.message);
  }
}

downloadFiles();