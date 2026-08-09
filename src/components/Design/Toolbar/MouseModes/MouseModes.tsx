import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { FC } from 'react';

// components
import ToolDropdown from './ToolDropdown/ToolDropdown';
import { Icon } from 'shared';

// others
import { TOOL_GROUP_ITEMS, TOOL_ICON, TOOL_ICON_SIZE, TOOLBAR_ORDER, TOOLS_WITH_DROPDOWN } from '../constants';

// store
import { selectActiveTool, selectLastShapeTool } from 'store/design/selectors';
import { setActiveTool } from 'store/design/slice';
import { useAppDispatch, useAppSelector } from 'store';

// styles
import styles from './mouse-modes.module.scss';

// types
import { ToolName } from 'types/design/enums';

const MouseModes: FC = () => {
  const activeTool = useAppSelector(selectActiveTool);
  const lastShapeTool = useAppSelector(selectLastShapeTool);
  const dispatch = useAppDispatch();

  return (
    <ToggleGroupPrimitive.Root
      className={styles.MouseModes}
      onValueChange={(value: string) => value && dispatch(setActiveTool(value as ToolName))}
      type="single"
      value={activeTool}
    >
      {TOOLBAR_ORDER.map((name) => {
        const displayedTool = TOOL_GROUP_ITEMS[name] ? lastShapeTool : name;

        return (
          <div className={styles['MouseModes__tool-group']} key={name}>
            <ToggleGroupPrimitive.Item aria-label={displayedTool} className={styles.MouseModes__button} value={displayedTool}>
              <Icon name={TOOL_ICON[displayedTool]} size={TOOL_ICON_SIZE[displayedTool]} />
            </ToggleGroupPrimitive.Item>
            {TOOLS_WITH_DROPDOWN.includes(name) && <ToolDropdown tool={name} />}
          </div>
        );
      })}
    </ToggleGroupPrimitive.Root>
  );
};

export default MouseModes;
