import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMaillTemplateProvider
  implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail Content';
  }
}
