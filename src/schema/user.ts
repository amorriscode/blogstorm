import { builder } from './builder'
import { db } from '../services/db'

const User = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
})

builder.queryFields((t) => ({
  user: t.prismaField({
    type: User,
    nullable: true,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (query, _, { id }) =>
      db.user.findUnique({
        ...query,
        where: { id },
      }),
  }),
}))
