export class InvalidSignature extends Error {
  constructor(message: string = "Assinatura inválida") {
    super(message);
  }
}
