import { CheckParticipantModel } from '~/persistence';
import { sumBy } from '~/utils/misc/sum-by';

export function calculateParticipantItemsSum(participant: CheckParticipantModel): number {
  return sumBy(participant.items!, 'sum');
}
