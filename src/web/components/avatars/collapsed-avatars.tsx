import { Avatar, AvatarGroup } from '@mantine/core';
import { Children, ReactNode, useState } from 'react';

type CollapsedAvatarsRenderProps = {
  collapsed: boolean;
};

type CollapsedAvatarsProps = {
  children: (props: CollapsedAvatarsRenderProps) => ReactNode | Array<ReactNode>;
  max: number;
};

export const CollapsedAvatars = ({ children, max }: CollapsedAvatarsProps) => {
  const [isCollapsed, setCollapsed] = useState(true);

  const childs = Children.toArray(children({ collapsed: isCollapsed }));
  const sliceChilds = childs.slice(0, max);
  const restChilds = childs.slice(max);

  if (isCollapsed) {
    return (
      <AvatarGroup>
        {sliceChilds}
        {!!restChilds.length && <Avatar onClick={() => setCollapsed(false)}>+{restChilds.length}</Avatar>}
      </AvatarGroup>
    );
  } else {
    return <>{childs}</>;
  }
};
