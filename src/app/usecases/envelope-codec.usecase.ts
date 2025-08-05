export enum EnvelopeType {
  // Пользователь принял приглашение на регистрацию в боте
  USER_INVITE_ACCEPTED = 'user_invite_accepted',
  // Чек создан и опубликован (уходит тому кто его создал)
  CHECK_CREATED = 'check_created',
  // Чек назначен на тебя (уходит всем участникам кроме того кто создал)
  CHECK_ASSIGNED = 'check_assigned',
  // Чек заполнен (уходит участнику, тому который только что и заполнил этот чек и выбрал в нём свои товары, а так же автору)
  CHECK_FILLED = 'check_filled'
}

export type Envelope =
  | { type: EnvelopeType.USER_INVITE_ACCEPTED; payload: { id: string } }
  | { type: EnvelopeType.CHECK_CREATED; payload: { id: string } }
  | { type: EnvelopeType.CHECK_ASSIGNED; payload: { id: string } }
  | { type: EnvelopeType.CHECK_FILLED; payload: { id: string; participantId: string } };

export function wrapEnvelope(envelope: Envelope): string {
  return JSON.stringify(envelope);
}

export function unwrapEnvelope(data: string): Envelope {
  return JSON.parse(data) as Envelope;
}
