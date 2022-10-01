import { GraphQLYogaError } from '@graphql-yoga/node'

import { builder } from './builder'
import { db } from '../services/db'
import { generateAccessToken } from '../services/auth'

const LogInInput = builder.inputType('LogInInput', {
  fields: (t) => ({
    twitterHandle: t.string({ required: true }),
  }),
})

const LogInResult = builder.simpleObject('LogInResult', {
  fields: (t) => ({
    jwt: t.field({ type: 'JWT', extensions: { skipAuth: true } }),
  }),
})

builder.mutationField('logIn', (t) =>
  t.field({
    type: LogInResult,
    args: {
      input: t.arg({ type: LogInInput, required: true }),
    },
    extensions: { skipAuth: true },
    resolve: async (query, { input: { twitterHandle } }) => {
      // TODO: Log a user in or create them in the database
      // after Twitter Oauth 2.0
      return { jwt: '1234' }
    },
  })
)
