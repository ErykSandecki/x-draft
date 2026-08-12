import { FC, FormEvent, useEffect, useRef } from 'react';

// others
import { TEXT_FILL, TEXT_FONT_FAMILY, TEXT_FONT_SIZE } from '../../constants';

// hooks
import { useCommitTextEdit } from './hooks/useCommitTextEdit';

// store
import { selectEditingTextBox, selectViewport } from 'store/design/selectors';
import { updateTextEditContent } from 'store/design/slice';
import { useAppDispatch, useAppSelector } from 'store';

// styles
import styles from './TextEditOverlay.module.scss';

// utils
import { worldToScreen } from '../../utils/worldToScreen';

const TextEditOverlay: FC = () => {
  const box = useAppSelector(selectEditingTextBox);
  const elementRef = useRef<HTMLDivElement>(null);
  const handleBlur = useCommitTextEdit(box);
  const viewport = useAppSelector(selectViewport);
  const dispatch = useAppDispatch();

  const handleInput = (event: FormEvent<HTMLDivElement>): void => {
    dispatch(updateTextEditContent(event.currentTarget.innerText));
  };

  useEffect(() => {
    if (box) {
      elementRef.current?.focus();
    }
  }, [box]);

  if (box) {
    const screen = worldToScreen(box, viewport);

    return (
      <div
        className={styles.TextEditOverlay}
        contentEditable
        onBlur={handleBlur}
        onInput={handleInput}
        ref={elementRef}
        style={{
          caretColor: TEXT_FILL,
          color: 'transparent',
          fontFamily: TEXT_FONT_FAMILY,
          fontSize: TEXT_FONT_SIZE * viewport.zoom,
          left: screen.x,
          top: screen.y,
          width: box.width * viewport.zoom,
        }}
      />
    );
  }

  return null;
};

export default TextEditOverlay;
