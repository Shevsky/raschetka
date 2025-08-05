import { Subject } from 'rxjs';

export const checkUpdatedEvent = new Subject<{ id: string; updatedByUserId: string }>();
