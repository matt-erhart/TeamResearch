import { TeamResearchPage } from './app.po';

describe('team-research App', function() {
  let page: TeamResearchPage;

  beforeEach(() => {
    page = new TeamResearchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
