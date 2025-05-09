const fs = require('fs');
const path = require('path');

// Chemins vers les fichiers de traduction
const localesDir = path.join(__dirname, '../locales');
const languages = ['en', 'fr', 'nl'];

// Charger toutes les traductions
const translations = {};
let allKeys = new Set();

languages.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      translations[lang] = JSON.parse(fileContent);
      
      // Collecter toutes les clés
      Object.keys(translations[lang]).forEach(key => allKeys.add(key));
    } catch (error) {
      console.error(`Erreur lors de la lecture du fichier de traduction ${lang}:`, error);
    }
  } else {
    console.warn(`Le fichier de traduction pour ${lang} n'existe pas.`);
  }
});

// Vérifier les traductions manquantes
console.log('=== Vérification des traductions manquantes ===');

languages.forEach(lang => {
  if (!translations[lang]) return;
  
  const missingKeys = [];
  
  allKeys.forEach(key => {
    if (!translations[lang][key]) {
      missingKeys.push(key);
    }
  });
  
  if (missingKeys.length > 0) {
    console.log(`\n[${lang}] Traductions manquantes (${missingKeys.length}):`);
    missingKeys.forEach(key => {
      console.log(`  - ${key}`);
      
      // Afficher la valeur en anglais pour référence si disponible
      if (translations.en && translations.en[key]) {
        console.log(`    (en: "${translations.en[key]}")`);
      }
    });
  } else {
    console.log(`\n[${lang}] Toutes les traductions sont présentes. ✅`);
  }
});

console.log('\n=== Fin de la vérification ===');
