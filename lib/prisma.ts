import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;

// import { PrismaClient } from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';

// const prismaClient = new PrismaClient().$extends(withAccelerate());

// declare global {
//   var prisma: typeof prismaClient | undefined;
// }

// const client = globalThis.prisma || prismaClient;
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

// export default client;
