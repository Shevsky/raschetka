import { Checkbox } from '@mantine/core';
import { UserModel } from '~/persistence';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';

type UserSelectableCompactCardProps = {
  user: UserModel;
  selected?: boolean;
  onClick?(): void;
};

export const UserSelectableCompactCard = ({ user, selected, onClick }: UserSelectableCompactCardProps) => {
  return (
    <UserCompactCard user={user} rightAccessory={<Checkbox.Indicator checked={selected} />} highlighted={selected} onClick={onClick} />
  );
};
