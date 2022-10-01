import { GraphQLYogaError } from '@graphql-yoga/node'

import { builder } from './builder'
import { db } from '../services/db'
import {
  generateAccessToken,
  hashPassword,
  validatePassword,
} from '../services/auth'

const LogInInput = builder.inputType('LogInInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
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
    resolve: async (query, { input: { email, password } }) => {
      const user = await db.user.findUnique({ where: { email } })

      if (!user || !validatePassword(user, password)) {
        throw new GraphQLYogaError('Unauthorized')
      }

      return { jwt: generateAccessToken(user) }
    },
  })
)

const SignUpInput = builder.inputType('SignUpInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
})

const SignUpResult = builder.simpleObject('SignUpResult', {
  fields: (t) => ({
    jwt: t.field({ type: 'JWT', extensions: { skipAuth: true } }),
  }),
})

builder.mutationField('signUp', (t) =>
  t.field({
    type: SignUpResult,
    args: {
      input: t.arg({ type: SignUpInput, required: true }),
    },
    extensions: { skipAuth: true },
    resolve: async (query, { input: { email, password } }) => {
      try {
        const user = await db.user.create({
          data: {
            email,
            passwordHash: hashPassword(password),
          },
        })

        return { jwt: generateAccessToken(user) }
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  })
)
