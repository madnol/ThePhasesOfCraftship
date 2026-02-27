import { MemberDm } from "@/modules/auth/domain/memberDm";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { UserDm } from "@/modules/auth/domain/userDm";

export function setupAuthStoreWithAuthenticatedUser(authStore: AuthStore, overrides?: {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
}) {
  const user = new UserDm({
    id: overrides?.userId || 'test-user-id',
    email: overrides?.email || 'test@example.com',
    username: overrides?.username || 'testuser',
    firstName: overrides?.firstName || 'Test',
    lastName: overrides?.lastName || 'User'
  });

  if (overrides?.username) {
    const member = new MemberDm({
      id: 'test-member-id',
      username: overrides.username,
      email: user.email,
      userId: user.id,
      reputationLevel: 'Level1'
    });
    authStore.authState.member = member;
  }

  authStore.authState.user = user;
  return { authStore, user };
}

export function setupAuthStoreWithMember(authStore: AuthStore, overrides?: {
  memberId?: string;
  username?: string;
  reputationLevel?: 'Level1' | 'Level2' | 'Level3';
}) {
  const user = new UserDm({
    id: 'test-user-id',
    email: 'test@example.com',
    username: overrides?.username || 'testuser'
  });

  const member = new MemberDm({
    id: overrides?.memberId || 'test-member-id',
    username: overrides?.username || 'testuser',
    email: user.email,
    userId: user.id,
    reputationLevel: overrides?.reputationLevel || 'Level1'
  });

  authStore.authState.user = user;
  authStore.authState.member = member;
  return { authStore, member };
} 