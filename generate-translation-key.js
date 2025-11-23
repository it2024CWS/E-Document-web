// generate-translation-key.js
import fs from 'fs';
import path from 'path';
// Get command line arguments
const [, , page, key] = process.argv;
if (!page || !key) {
  console.error('Usage: node gen_translate.js <page> <key> [value]');
  console.error('Example: node gen_translate.js home_page title "Welcome to our site"');
  console.error('Note: If value contains spaces, wrap it in quotes');
  process.exit(1);
}
// Configuration
const TRANSLATION_DIR = './src/translations';
const SUPPORTED_LANGS = ['en', 'la'];
// Function to load existing translation file
const loadTranslationFile = (lang) => {
  const filePath = path.join(TRANSLATION_DIR, lang, `global.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return empty object if file doesn't exist
      return {};
    }
    throw error;
  }
};
// Function to save translation file
const saveTranslationFile = (lang, data) => {
  const dirPath = path.join(TRANSLATION_DIR, lang);
  const filePath = path.join(dirPath, `global.json`);
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  // Save file with pretty formatting
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
// Function to update translations
const updateTranslations = () => {
  try {
    SUPPORTED_LANGS.forEach((lang) => {
      // Load existing translations
      const translations = loadTranslationFile(lang);
      // Initialize page object if it doesn't exist
      if (!translations[page]) {
        translations[page] = {};
      }
      // Add or update the key
      const oldValue = translations[page][key];
      translations[page][key] = key || '';
      // Log the action
      if (oldValue === undefined) {
        console.log(`Added key '${key}' to ${lang}/global.json`);
        if (lang === 'en' && key) {
          console.log(`Set English value to: "${key}"`);
        }
      } else {
        console.log(`Updated key '${key}' in ${lang}/global.json`);
        if (lang === 'en' && key && oldValue !== key) {
          console.log(`Changed English value from "${oldValue}" to "${key}"`);
        }
      }
      // Save updated translations
      saveTranslationFile(lang, translations);
    });
    console.log('\nSuccess! Translation keys have been added/updated.');
    console.log('\nCurrent structure in translation files:');
    console.log(JSON.stringify({ [page]: { [key]: key || '' } }, null, 2));
    if (!value) {
      console.log("\nDon't forget to add your translations in:");
      SUPPORTED_LANGS.forEach((lang) => {
        console.log(`- ${TRANSLATION_DIR}/${lang}/$global.json`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};
// Run the update
updateTranslations();
