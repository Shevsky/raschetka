import { Stack } from '@mantine/core';
import { AccountsSection } from '~/web/pages/user/components/accounts-section';
import { AssignedChecksSection } from '~/web/pages/user/components/assigned-checks-section';
import { CreatedChecksSection } from '~/web/pages/user/components/created-checks-section';
import { FriendsSection } from '~/web/pages/user/components/friends-section';
import { InviterSection } from '~/web/pages/user/components/inviter-section';
import { PermissionsSection } from '~/web/pages/user/components/permissions-section';
import { RegistrationDateSection } from '~/web/pages/user/components/registration-date-section';

export const MainSection = () => {
  return (
    <Stack gap="lg">
      <RegistrationDateSection />
      <AccountsSection />
      <PermissionsSection />
      <InviterSection />
      <FriendsSection />
      <CreatedChecksSection />
      <AssignedChecksSection />
    </Stack>
  );
};
