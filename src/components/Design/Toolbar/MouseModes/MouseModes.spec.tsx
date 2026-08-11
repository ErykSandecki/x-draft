import userEvent from '@testing-library/user-event';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

// components
import MouseModes from './MouseModes';

// store
import { setActiveTool } from 'store/design/slice';
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

  it('should show the last selected shape tool on the shared rectangle/ellipse button', () => {
    // before
    render(
      <Provider store={store}>
        <MouseModes />
      </Provider>,
    );

    // action
    act(() => store.dispatch(setActiveTool(ToolName.ellipse)));

    // result
    expect(screen.getByRole('radio', { name: ToolName.ellipse })).toBeChecked();
  });

  it('should keep showing the last shape tool but unchecked once the tool resets to default', () => {
    // before
    render(
      <Provider store={store}>
        <MouseModes />
      </Provider>,
    );

    // action
    act(() => store.dispatch(setActiveTool(ToolName.ellipse)));
    act(() => store.dispatch(setActiveTool(ToolName.default)));

    // result
    expect(screen.getByRole('radio', { name: ToolName.ellipse })).not.toBeChecked();
  });

  it('should show the last selected mouse tool on the shared default/hand button', () => {
    // before
    render(
      <Provider store={store}>
        <MouseModes />
      </Provider>,
    );

    // action
    act(() => store.dispatch(setActiveTool(ToolName.hand)));

    // result
    expect(screen.getByRole('radio', { name: ToolName.hand })).toBeChecked();
  });

  it('should close the previously open dropdown when a different one is opened', async () => {
    // mock
    const user = userEvent.setup();

    // before
    render(
      <Provider store={store}>
        <MouseModes />
      </Provider>,
    );

    // action
    await user.click(screen.getByRole('button', { name: 'default options' }));

    // result
    expect(screen.getByText('Hand tool')).toBeInTheDocument();

    // action
    await user.click(screen.getByRole('button', { name: 'frame options' }));

    // result — opening the frame dropdown must close the still-open default dropdown, not stack
    expect(screen.queryByText('Hand tool')).not.toBeInTheDocument();
    expect(screen.getByText('Frame')).toBeInTheDocument();
  });
});
