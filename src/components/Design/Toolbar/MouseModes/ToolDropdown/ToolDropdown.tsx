import { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import { Icon, Popover, PopoverCompound } from 'shared';

// others
import { KEYBOARD_SHORTCUTS } from '../../../keys';
import { TOOL_ICON, TOOL_LABEL } from '../../constants';

// store
import { setActiveTool } from 'store/design/designSlice';
import { useAppDispatch } from 'store';

// styles
import styles from './tool-dropdown.module.scss';

// types
import { ToolName } from 'types/design/enums';

const { PopoverItem } = PopoverCompound;

export type TToolDropdownProps = {
  tool: ToolName;
};

const ToolDropdown: FC<TToolDropdownProps> = ({ tool }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Popover
      trigger={<Icon name="ChevronDown" size={5} />}
      triggerAriaLabel={`${tool} options`}
      triggerClassName={styles.ToolDropdown}
    >
      <PopoverItem
        icon={TOOL_ICON[tool]}
        label={t(TOOL_LABEL[tool])}
        onClick={() => dispatch(setActiveTool(tool))}
        selected
        shortcut={KEYBOARD_SHORTCUTS[tool].join('')}
      />
    </Popover>
  );
};

export default ToolDropdown;
