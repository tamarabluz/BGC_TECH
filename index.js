const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const scrapePokemonInfo = async (pokemonName) => {
  let result;

  try {
    const executablePath = await chromium.executablePath;
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    

    console.log('Browser launched');

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    console.log('New page created');

    await page.goto(`https://pokemon.fandom.com/pt-br/wiki/${encodeURIComponent(pokemonName.pokemonName)}`);

    console.log('Page loaded:', `https://pokemon.fandom.com/pt-br/wiki/${encodeURIComponent(pokemonName.pokemonName)}`);


    const number = await page.evaluate(() => {
        const numberElement = document.querySelector('td[width="30%"] big b');
        return numberElement ? numberElement.textContent.trim() : '';
      });

      console.log('Number:', number);

    const types = await page.evaluate(() => {
        const typeElements = document.querySelectorAll('td.modoclaroescuro table tbody tr td a font');
        const types = [];
      
        typeElements.forEach((typeElement) => {
          const type = typeElement.textContent.trim();
          types.push(type);
        });
      
        return types;
      });
      
      console.log('Tipos:', types);

    const category = await page.evaluate(() => {
        const categoryElement = document.querySelector('td.modoclaroescuro');
        return categoryElement ? categoryElement.textContent.trim() : '';
      });
  
      console.log('Category:', category);

    const height = await page.evaluate(() => {
        const heightElement = document.querySelector('td.modoclaroescuro[colspan="1"][width="50%"]');
        return heightElement ? heightElement.textContent.trim() : '';
      });
      
      console.log('Height:', height);

    const abilities = await page.evaluate(() => {
        const abilitiesElement = document.querySelector('td.modoclaroescuro[colspan="2"][width="100%"]');
        const abilities = [];
      
        if (abilitiesElement) {
          const abilityElements = abilitiesElement.querySelectorAll('a, span.new');
      
          abilityElements.forEach((abilityElement) => {
            const abilityText = abilityElement.textContent.trim();
            abilities.push(abilityText);
          });
        }
      
        return abilities;
      });
      
      console.log('Abilities:', abilities);
    
      

    await browser.close();
    console.log('Browser closed');

    result = {
      name: pokemonName.pokemonName,
      number,
      types,
      category,
      height,
      abilities,
    
    };
  } catch (error) {
    console.error('Error scraping Pokémon info:', error);
    throw error;
  }

  return result;
};

module.exports = {
  scrapePokemonInfo,
};

exports.handler = async (event) => {
  try {
    const pokemonName = event;
    const pokemonInfo = await scrapePokemonInfo(pokemonName);
    console.log(pokemonInfo);
    
  } catch (error) {
    console.error('Error:', error);
   
  }
};
