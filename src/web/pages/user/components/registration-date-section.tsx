import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { formatLocaleDate } from '~/utils/formatters/format-locale-date';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { UserContext } from '~/web/pages/user/user.context';

export const RegistrationDateSection = observer(() => {
  const store = useContext(UserContext);

  const user = store.user;

  return <LabeledRow name="Дата регистрации">{formatLocaleDate(user.createdAt, { year: true })}</LabeledRow>;
});
