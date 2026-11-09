import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import FuelTechPage from '../support/pages/FuelTechPage';

test.describe('FuelTech - loja virtual', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.fueltech')
    .retrieveData();
  const PRODUTO = 'FT600 SFI - Injeção Eletrônica Programável FuelTech';
  const PRODUTO_URL = '/products/ft600-sfi-injecao-eletronica';
  const CHICOTE = 'Com chicote 3m (+R$1.199,00)';
  const PRECO_CHICOTE = 1199;
  let fuelTechPage: FuelTechPage;

  test.use({ baseURL: BASE_URL });

  test.beforeEach(async ({ page }) => {
    fuelTechPage = new FuelTechPage(page);
    await fuelTechPage.fecharBannerDeCookiesQuandoAparecer();
    await page.goto('/');
  });

  test('CT01 - Buscar produto pelo nome', async () => {
    await fuelTechPage.buscarProduto('FT600');
    await fuelTechPage.validarResultadoDaBusca('FT600', PRODUTO);
  });

  test('CT02 - Buscar produto inexistente', async () => {
    await fuelTechPage.buscarProduto('xyzabc123');
    await fuelTechPage.validarBuscaSemResultado('xyzabc123');
  });

  test('CT03 - Não adicionar ao carrinho sem escolher o chicote elétrico', async () => {
    await fuelTechPage.acessarProduto(PRODUTO_URL, 'FT600 SFI');
    await fuelTechPage.adicionarAoCarrinho();
    await fuelTechPage.validarOpcaoObrigatoria(PRODUTO_URL);
  });

  test('CT04 - Adicionar FT600 com chicote ao carrinho', async () => {
    await fuelTechPage.acessarProduto(PRODUTO_URL, 'FT600 SFI');
    const preco = await fuelTechPage.obterPrecoDoProduto();
    await fuelTechPage.escolherOpcoes(CHICOTE, 'Não preciso');
    await fuelTechPage.adicionarAoCarrinho();
    await fuelTechPage.validarCarrinho(PRODUTO, preco + PRECO_CHICOTE);
  });
});
