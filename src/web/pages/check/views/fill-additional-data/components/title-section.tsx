import { TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useContext } from 'react';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';

export const TitleSection = observer(() => {
  const store = useContext(CheckContext);

  const defaultTitle = store.check.retailPlaceName || store.check.companyName;
  const value = store.specifiedTitle;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    store.handleChangeSpecifiedTitle(event.target.value);
  };

  return (
    <LabeledRow name="Имя чека" note={`По умолчанию: ${defaultTitle}`}>
      <TextInput value={value} placeholder={defaultTitle} onChange={handleChange} />
    </LabeledRow>
  );
});
