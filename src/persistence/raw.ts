export interface FiscalRaw {
  ticket: FiscalTicketRaw;
}

export interface FiscalTicketRaw {
  document: FiscalDocumentRaw;
}

export interface FiscalDocumentRaw {
  receipt: FiscalReceiptRaw;
}

export interface FiscalReceiptRaw {
  fiscalDocumentNumber: number;
  fiscalDriveNumber: string;
  fiscalSign: number;
  kktRegId: string;
  dateTime: string;
  items: Array<FiscalReceiptItemRaw>;
  totalSum: number;
  retailPlace: string;
  retailPlaceAddress: string;
  user: string;
  userInn: string;
}

export interface FiscalReceiptItemRaw {
  name: string;
  price: number;
  quantity: number;
  sum: number;
}
