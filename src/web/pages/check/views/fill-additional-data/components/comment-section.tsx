import { Anchor, Textarea } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, SyntheticEvent, useContext } from 'react';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';

export const CommentSection = observer(() => {
  const store = useContext(CheckContext);

  const value = store.specifiedComment;
  const possibleComment = store.latestPrevCheckComment;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    store.handleChangeSpecifiedComment(event.target.value);
  };

  const handlePossibleComment = (event: SyntheticEvent) => {
    event.preventDefault();
    store.handleChangeSpecifiedComment(possibleComment!);
  };

  return (
    <LabeledRow
      name="Комментарий"
      note={
        possibleComment && (
          <>
            В&nbsp;прошлый раз было:{' '}
            <Anchor href="#" onClick={handlePossibleComment}>
              {possibleComment}
            </Anchor>
          </>
        )
      }
    >
      <Textarea value={value} placeholder="Например, куда переводить денежки и в какой банк" onChange={handleChange} minRows={3} autosize />
    </LabeledRow>
  );
});
