import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { MoneyControl } from '~/web/components/controls/money-control';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';

export const TipsSection = observer(() => {
  const store = useContext(CheckContext);

  const value = store.specifiedTipsSum;

  const handleChange = (nextValue: string | number) => {
    store.handleChangeSpecifiedTipsSum(Number(nextValue) || 0);
  };

  return (
    <LabeledRow name="Чаевые" note="Если указать чаевые, то они будут поделены между всеми">
      <MoneyControl value={value} onChange={handleChange} />
    </LabeledRow>
  );
});
