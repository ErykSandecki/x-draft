// types
import { TKeyboardShortcuts } from './types';
import { ToolName } from 'types/design/enums';

export const KEYBOARD_SHORTCUTS: TKeyboardShortcuts = {
  [ToolName.comment]: ['C'],
  [ToolName.default]: ['V'],
  [ToolName.ellipse]: ['O'],
  [ToolName.frame]: ['F'],
  [ToolName.line]: ['L'],
  [ToolName.rectangle]: ['R'],
};
