import { Page, expect } from '@playwright/test';
import FuelTechElements from '../elements/FuelTechElements';
import BasePage from './BasePage';

export default class FuelTechPage extends BasePage {
  readonly fuelTechElements: FuelTechElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.fuelTechElements = new FuelTechElements(page);
  }

  // O banner de cookies aparece a cada visita e cobre a página.
  async fecharBannerDeCookiesQuandoAparecer(): Promise<void> {
    await this.page.addLocatorHandler(
      this.fuelTechElements.getCookieDialog(),
      async () => {
        await this.fuelTechElements.getRejectCookiesButton().click();
      }
    );
  }

  async buscarProduto(termo: string): Promise<void> {
    await this.fuelTechElements.getSearchToggle().click();
    await this.fuelTechElements.getSearchField().fill(termo);
    await this.fuelTechElements.getSearchField().press('Enter');
  }

  async validarResultadoDaBusca(termo: string, produto: string): Promise<void> {
    await expect(this.page).toHaveTitle(
      new RegExp(`[1-9]\\d* resultados encontrados para "${termo}"`)
    );
    await expect(this.fuelTechElements.getSearchResult(produto)).toBeVisible();
  }

  async validarBuscaSemResultado(termo: string): Promise<void> {
    await this.verifyTitle(
      `Pesquisa: 0 resultados encontrados para "${termo}" - FuelTech Brasil`
    );
  }

  async acessarProduto(caminho: string, nome: string): Promise<void> {
    await this.page.goto(caminho);
    await expect(this.fuelTechElements.getProductTitle()).toHaveText(
      new RegExp(nome, 'i')
    );
  }

  async adicionarAoCarrinho(): Promise<void> {
    await this.fuelTechElements.getAddToCartButton().click();
  }

  async validarOpcaoObrigatoria(caminho: string): Promise<void> {
    await expect(
      this.fuelTechElements.getRequiredOptionMessage()
    ).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(caminho));
  }

  async obterPrecoDoProduto(): Promise<number> {
    const precoElement = this.fuelTechElements.getProductPrice();
    await expect(precoElement).toHaveText(/R\$ [\d.]+,\d{2}/);
    return this.converterParaNumero(await precoElement.innerText());
  }

  async escolherOpcoes(chicote: string, coxim: string): Promise<void> {
    await this.fuelTechElements.getHarnessSelect().selectOption(chicote);
    await this.fuelTechElements.getEngineMountSelect().selectOption(coxim);
  }

  async validarCarrinho(produto: string, subtotal: number): Promise<void> {
    await expect(this.page).toHaveURL(/\/cart/);
    await expect(this.fuelTechElements.getCartHeading()).toBeVisible();
    await expect(this.fuelTechElements.getCartItem(produto)).toBeVisible();
    await expect(this.fuelTechElements.getCartItemOptions()).toBeVisible();
    await expect(
      this.fuelTechElements.getCartSubtotal(this.formatarEmReais(subtotal))
    ).toBeVisible();
  }

  // "R$ 10.990,00" -> 10990
  converterParaNumero(valor: string): number {
    return Number(valor.replace(/[^\d,]/g, '').replace(',', '.'));
  }

  // 12189 -> "R$ 12.189,00"
  formatarEmReais(valor: number): string {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
}
