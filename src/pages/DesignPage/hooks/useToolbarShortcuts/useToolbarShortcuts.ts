import { useMemo } from 'react';

// hooks
import { TKeysMap, useKeyboardHandler } from 'hooks';

// store
import { setActiveTool } from 'store/design/slice';
import { useAppDispatch } from 'store';

// types
import { KeyboardKeys } from 'types/enums';
import { ToolName } from 'types/design/enums';

export const useToolbarShortcuts = (): void => {
  const dispatch = useAppDispatch();

  const keysMap: TKeysMap = useMemo(
    () => [
      { action: (): any => dispatch(setActiveTool(ToolName.default)), secondaryKey: KeyboardKeys.v },
      { action: (): any => dispatch(setActiveTool(ToolName.frame)), secondaryKey: KeyboardKeys.f },
      { action: (): any => dispatch(setActiveTool(ToolName.comment)), secondaryKey: KeyboardKeys.c },
      { action: (): any => dispatch(setActiveTool(ToolName.default)), secondaryKey: KeyboardKeys.escape },
    ],
    [dispatch],
  );

  useKeyboardHandler(true, [], keysMap, undefined, true);
};
