import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { exhaustiveCheck } from '~/utils/misc/exhaustive-check';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';
import { ConfirmFillView } from '~/web/pages/check/views/confirm-fill/confirm-fill-view';
import { ConfirmPickedItemsView } from '~/web/pages/check/views/confirm-picked-items/confirm-picked-items-view';
import { FillAdditionalDataView } from '~/web/pages/check/views/fill-additional-data/fill-additional-data-view';
import { FillItemGroupsView } from '~/web/pages/check/views/fill-item-groups/fill-item-groups-view';
import { FillParticipantsView } from '~/web/pages/check/views/fill-participants/fill-participants-view';
import { InfoView } from '~/web/pages/check/views/info/info-view';
import { ItemsView } from '~/web/pages/check/views/items/items-view';
import { PickItemsView } from '~/web/pages/check/views/pick-items/pick-items-view';
import { SeeItemGroupView } from '~/web/pages/check/views/see-item-group/see-item-group-view';
import { SeeParticipantView } from '~/web/pages/check/views/see-participant/see-participant-view';
import { useResetScroll } from '~/web/utils/hooks/use-reset-scroll';

export const MainSection = observer(() => {
  const store = useContext(CheckContext);

  const view = store.view;

  useResetScroll([view.type]);

  switch (view.type) {
    case CheckViewType.INFO: {
      return <InfoView />;
    }
    case CheckViewType.ITEMS: {
      return <ItemsView />;
    }
    case CheckViewType.FILL_PARTICIPANTS: {
      return <FillParticipantsView />;
    }
    case CheckViewType.FILL_ITEM_GROUPS: {
      return <FillItemGroupsView />;
    }
    case CheckViewType.FILL_ADDITIONAL_DATA: {
      return <FillAdditionalDataView />;
    }
    case CheckViewType.CONFIRM_FILL: {
      return <ConfirmFillView />;
    }
    case CheckViewType.SEE_PARTICIPANT: {
      return <SeeParticipantView {...view.payload} />;
    }
    case CheckViewType.SEE_ITEM_GROUP: {
      return <SeeItemGroupView {...view.payload} />;
    }
    case CheckViewType.PICK_ITEMS: {
      return <PickItemsView />;
    }
    case CheckViewType.CONFIRM_PICKED_ITEMS: {
      return <ConfirmPickedItemsView />;
    }
    default: {
      return exhaustiveCheck(view);
    }
  }
});
