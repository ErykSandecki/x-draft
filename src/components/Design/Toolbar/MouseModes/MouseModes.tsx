import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { FC } from 'react';

// components
import ToolDropdown from './ToolDropdown/ToolDropdown';
import { Icon } from 'shared';

// others
import { TOOL_ICON, TOOLBAR_ORDER, TOOLS_WITH_DROPDOWN } from '../constants';

// store
import { selectActiveTool } from 'store/design/selectors';
import { setActiveTool } from 'store/design/designSlice';
import { useAppDispatch, useAppSelector } from 'store';

// styles
import styles from './mouse-modes.module.scss';

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
      {TOOLBAR_ORDER.map((name) => (
        <div className={styles['MouseModes__tool-group']} key={name}>
          <ToggleGroupPrimitive.Item aria-label={name} className={styles.MouseModes__button} value={name}>
            <Icon name={TOOL_ICON[name]} />
          </ToggleGroupPrimitive.Item>
          {TOOLS_WITH_DROPDOWN.includes(name) && <ToolDropdown tool={name} />}
        </div>
      ))}
    </ToggleGroupPrimitive.Root>
  );
};

export default MouseModes;
