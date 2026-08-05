import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { FC } from 'react';

// components
import { Icon } from 'shared';

// others
import { TOOL_ICON } from '../constants';

// store
import { selectActiveTool } from 'store/design/selectors';
import { setActiveTool } from 'store/design/designSlice';
import { useAppDispatch, useAppSelector } from 'store';

// styles
import styles from './MouseModes.module.scss';

// types
import { ToolName } from 'types/design/enums';

const MouseModes: FC = () => {
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();

  return (
    <ToggleGroupPrimitive.Root
      className={styles.MouseModes}
      onValueChange={(value: string) => value && dispatch(setActiveTool(value as ToolName))}
      type="single"
      value={activeTool}
    >
      {Object.values(ToolName).map((name) => (
        <ToggleGroupPrimitive.Item aria-label={name} className={styles.button} key={name} value={name}>
          <Icon name={TOOL_ICON[name]} />
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
};

export default MouseModes;
