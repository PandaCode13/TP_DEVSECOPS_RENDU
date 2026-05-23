import { describe, expect, it } from 'vitest';
import { canEditTicket } from '@/lib/permissions';

describe('permissions.ts — canEditTicket', () => {
  it('allows an admin to edit any ticket', () => {
    expect(
      canEditTicket(
        { id: 'admin-1', role: 'ADMIN' },
        { authorId: 'user-1' }
      )
    ).toBe(true);
  });

  it('allows an agent to edit any ticket', () => {
    expect(
      canEditTicket(
        { id: 'agent-1', role: 'AGENT' },
        { authorId: 'user-1' }
      )
    ).toBe(true);
  });

  it('allows a user to edit their own ticket', () => {
    expect(
      canEditTicket(
        { id: 'user-1', role: 'USER' },
        { authorId: 'user-1' }
      )
    ).toBe(true);
  });

  it('rejects a user editing someone else ticket', () => {
    expect(
      canEditTicket(
        { id: 'user-1', role: 'USER' },
        { authorId: 'user-2' }
      )
    ).toBe(false);
  });
});
