import IParseMaillTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMaillTemplateDTO): Promise<string>;
}
