interface Props {
  name: "PrismaClientKnownRequestError",
  code: "P2002",
  clientVersion: "5.6.0",
  meta: {
    target: string[]
  }
}

export const prisma_error = (error: Props) => {
  if (error.code === 'P2002') {
    return error.meta.target.map(item => `${item} already exists!`);
  }
}