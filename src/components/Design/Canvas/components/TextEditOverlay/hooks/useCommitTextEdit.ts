import { FocusEvent } from 'react';

// others
import { TEXT_FILL, TEXT_FONT_FAMILY, TEXT_FONT_SIZE, TEXT_NAME } from '../../../constants';

// store
import { addNode, stopTextEdit } from 'store/design/slice';
import { selectViewport } from 'store/design/selectors';
import { useAppDispatch, useAppSelector } from 'store';

// types
import { NodeType } from 'types/design/enums';
import { TEditingTextBox } from 'types/canvas';

export const useCommitTextEdit = (box: TEditingTextBox | null): ((event: FocusEvent<HTMLDivElement>) => void) => {
  const viewport = useAppSelector(selectViewport);
  const dispatch = useAppDispatch();

  return (event: FocusEvent<HTMLDivElement>): void => {
    if (box) {
      const content = event.currentTarget.innerText;

      if (content.length > 0) {
        const height = event.currentTarget.getBoundingClientRect().height / viewport.zoom;

        dispatch(
          addNode({
            content,
            fill: TEXT_FILL,
            fontFamily: TEXT_FONT_FAMILY,
            fontSize: TEXT_FONT_SIZE,
            height,
            name: TEXT_NAME,
            parentId: null,
            rotation: 0,
            type: NodeType.text,
            width: box.width,
            x: box.x,
            y: box.y,
          }),
        );
      }

      dispatch(stopTextEdit());
    }
  };
};
