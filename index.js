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
      
      

    
      

    await browser.close();
    console.log('Browser closed');

    result = {
      name: pokemonName.pokemonName,
      number,
    
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
