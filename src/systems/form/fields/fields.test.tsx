import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Form } from '../form';

import { SwitchField } from './switch-field';
import { TagsField } from './tags-field';
import { TimeField } from './time-field';

/** These fields read react-hook-form through FieldShell rather than a Controller
 *  render prop. The point of these tests is that they still join the same form
 *  context and submit alongside everything else. */
const schema = z.object({
  names: z.array(z.string()).min(1, 'Add at least one name').max(2, 'At most two names'),
  startTime: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, 'Enter a time like 09:00'),
  isActive: z.boolean(),
});

function Harness({ onSubmit }: { onSubmit: (values: z.infer<typeof schema>) => void }) {
  return (
    <Form<z.infer<typeof schema>>
      schema={schema}
      defaultValues={{ names: [], startTime: '', isActive: false }}
      onSubmit={onSubmit}
    >
      <TagsField name="names" label="Observed as" maxItems={2} />
      <TimeField name="startTime" label="Starts" />
      <SwitchField name="isActive" label="Active" />
      <button type="submit">Save</button>
    </Form>
  );
}

// This project runs vitest without `globals: true` and without a setup file,
// so testing-library never registers its own cleanup and renders would stack.
afterEach(cleanup);

describe('custom fields inside the toolkit Form', () => {
  it('surfaces schema errors on the fields it owns', async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Add at least one name')).toBeDefined();
    expect(screen.getByText('Enter a time like 09:00')).toBeDefined();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('collects values from all three field types', async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Observed as' }), 'Diwali{Enter}');
    await userEvent.type(screen.getByLabelText('Starts'), '09:30');
    // By role, so this also asserts the switch has an accessible name. Base UI
    // names it through aria-labelledby, which a bare htmlFor does not satisfy.
    await userEvent.click(screen.getByRole('switch', { name: 'Active' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual({
      names: ['Diwali'],
      startTime: '09:30',
      isActive: true,
    });
  });

  it('toggles the switch from its label, not just the control', async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Observed as' }), 'Diwali{Enter}');
    await userEvent.type(screen.getByLabelText('Starts'), '09:30');
    await userEvent.click(screen.getByText('Active'));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0].isActive).toBe(true);
  });

  it('stops accepting tags at maxItems and removes the last on backspace', async () => {
    render(<Harness onSubmit={vi.fn()} />);
    const input = screen.getByRole('textbox', { name: 'Observed as' });

    await userEvent.type(input, 'Diwali{Enter}Govardhan{Enter}');
    expect(screen.getByLabelText('Remove Diwali')).toBeDefined();
    expect(screen.getByLabelText('Remove Govardhan')).toBeDefined();
    expect((input as HTMLInputElement).disabled).toBe(true);

    await userEvent.click(screen.getByLabelText('Remove Govardhan'));
    expect(screen.queryByLabelText('Remove Govardhan')).toBeNull();
  });
});
