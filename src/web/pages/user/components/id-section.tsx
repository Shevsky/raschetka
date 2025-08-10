import { Box, Group } from '@mantine/core';
import { IconCopy } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { doneReactions } from '~/utils/dicts/reactions.dict';
import { choice } from '~/utils/misc/choice';
import { noop } from '~/utils/misc/noop';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { UserContext } from '~/web/pages/user/user.context';
import { showAlert } from '~/web/utils/behaviors/show-alert';
import { copyToClipboard } from '~/web/utils/misc/copy-to-clipboard';

export const IDSection = observer(() => {
  const store = useContext(UserContext);

  const user = store.user;

  const handleCopy = () => {
    copyToClipboard(user.id)
      .then(() => showAlert('success', choice(doneReactions), 'ID пользователя скопирован'))
      .catch(noop);
  };

  return (
    <LabeledRow name="ID пользователя">
      <Group align="center" justify="space-between">
        <Box flex="1" style={{ whiteSpace: 'nowrap' }}>
          {user.id}
        </Box>
        <Box flex="0 0">
          <IconCopy onClick={handleCopy} />
        </Box>
      </Group>
    </LabeledRow>
  );
});
