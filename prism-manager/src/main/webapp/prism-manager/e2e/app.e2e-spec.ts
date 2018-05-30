import { PrismManagerPage } from './app.po';

describe('prism-manager App', () => {
  let page: PrismManagerPage;

  beforeEach(() => {
    page = new PrismManagerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
