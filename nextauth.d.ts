// nextauth.d.ts
import { $Enums } from '@prisma/client';
import { DefaultSession, DefaultUser } from 'next-auth';

// common interface for JWT and Session
interface IUser extends DefaultUser {
  role: $Enums.Role;
}

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
