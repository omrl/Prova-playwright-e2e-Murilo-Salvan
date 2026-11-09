import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class FuelTechElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  getCookieDialog(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Quer uma melhor experiência no nosso site?'
    });
  }

  getRejectCookiesButton(): Locator {
    return this.getCookieDialog().getByRole('button', { name: 'Rejeitar' });
  }

  getSearchToggle(): Locator {
    return this.page
      .getByRole('link', { name: 'Pesquisar' })
      .filter({ visible: true });
  }

  getSearchField(): Locator {
    return this.page.getByPlaceholder('Pesquise por nome, modelo, código');
  }

  getSearchResult(productName: string): Locator {
    return this.page
      .getByRole('link', { name: productName })
      .filter({ hasText: productName })
      .first();
  }

  getProductTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 }).first();
  }

  getProductPrice(): Locator {
    return this.page.locator('.current_price .money').first();
  }

  getHarnessSelect(): Locator {
    return this.page.getByRole('combobox', {
      name: 'Escolha o chicote elétrico'
    });
  }

  getEngineMountSelect(): Locator {
    return this.page.getByRole('combobox', { name: 'Precisa do kit coxim?' });
  }

  getAddToCartButton(): Locator {
    return this.page
      .getByRole('button', { name: 'Adicionar ao Carrinho' })
      .filter({ visible: true })
      .first();
  }

  getRequiredOptionMessage(): Locator {
    return this.page.getByText('Opção obrigatória');
  }

  getCartHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Carrinho de compras' });
  }

  // A página também tem um mini-carrinho (#cart) com os mesmos textos.
  getCartForm(): Locator {
    return this.page.locator('#cart_form');
  }

  getCartItem(productName: string): Locator {
    // A imagem do item também é um link com o mesmo nome, por isso filtra pelo texto.
    return this.getCartForm()
      .getByRole('link', { name: productName, exact: true })
      .filter({ hasText: productName });
  }

  getCartItemOptions(): Locator {
    return this.getCartForm().getByText('Escolha o chicote elétrico:');
  }

  getCartSubtotal(value: string): Locator {
    return this.getCartForm().getByText(`${value} BRL`, { exact: true });
  }
}
