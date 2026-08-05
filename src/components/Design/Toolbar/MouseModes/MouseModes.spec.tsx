import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

// components
import MouseModes from './MouseModes';

// store
import { store } from 'store';

// types
import { ToolName } from 'types/design/enums';

describe('MouseModes snapshots', () => {
  it('should render MouseModes', () => {
    // before
    const { asFragment } = render(
      <Provider store={store}>
        <MouseModes />
      </Provider>,
    );

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('MouseModes behaviors', () => {
  it('should change active tool', () => {
    // before
    const { getByRole } = render(
      <Provider store={store}>
        <MouseModes />
      </Provider>,
    );

    // action
    fireEvent.click(getByRole('radio', { name: ToolName.frame }));

    // result
    expect(store.getState().design.activeTool).toBe(ToolName.frame);
  });
});
