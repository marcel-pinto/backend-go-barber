interface IErrorDTO {
  message: string;
  statusCode?: number;
}

export default class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor({ message, statusCode = 400 }: IErrorDTO) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
