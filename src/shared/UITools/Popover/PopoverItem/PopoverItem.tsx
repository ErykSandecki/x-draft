import * as PopoverPrimitive from '@radix-ui/react-popover';
import { FC } from 'react';

// components
import { Icon, TIconProps } from 'shared/UI/Icon/Icon';

// styles
import styles from './popover-item.module.scss';

export type TPopoverItemProps = {
  checkIconSize?: number;
  icon?: TIconProps['name'];
  iconSize?: number;
  label: string;
  onClick?: () => void;
  selected?: boolean;
  shortcut?: string;
};

export const PopoverItem: FC<TPopoverItemProps> = ({
  checkIconSize = 14,
  icon,
  iconSize = 14,
  label,
  onClick,
  selected = false,
  shortcut,
}) => (
  <PopoverPrimitive.Close asChild>
    <div className={styles.PopoverItem} onClick={onClick}>
      <span style={{ opacity: selected ? 1 : 0 }}>
        <Icon name="Check" size={checkIconSize} />
      </span>
      {icon && <Icon name={icon} size={iconSize} />}
      <span className={styles.PopoverItem__label}>{label}</span>
      {shortcut && <span className={styles.PopoverItem__shortcut}>{shortcut}</span>}
    </div>
  </PopoverPrimitive.Close>
);

export default PopoverItem;
