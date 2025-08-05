import { identityProxy } from '~/utils/misc/identity-proxy';

// Все сценарии объявляются здесь ⬇️ чтобы их имена точно не пересекались и были уникальными
export const { checkScenario, meScenario } = identityProxy();
