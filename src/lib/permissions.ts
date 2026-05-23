type User = {
  id: string;
  role: string;
};

type Ticket = {
  authorId: string;
};

export function canEditTicket(user: User, ticket: Ticket): boolean {
  if (user.role === 'ADMIN' || user.role === 'AGENT') return true;
  return user.role === 'USER' && ticket.authorId === user.id;
}
