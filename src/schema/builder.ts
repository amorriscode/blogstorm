import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'
import { GraphQLDateTime, GraphQLJWT } from 'graphql-scalars'

import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { db } from '../services/db'
import { User } from '@prisma/client'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: {
    currentUser: User
  }
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
    JWT: {
      Input: string
      Output: string
    }
  }
}>({
  plugins: [PrismaPlugin, SimpleObjectsPlugin],
  prisma: {
    client: db,
    filterConnectionTotalCount: true,
  },
})

builder.addScalarType('DateTime', GraphQLDateTime, {})
builder.addScalarType('JWT', GraphQLJWT, {})

builder.queryType({})
builder.mutationType({})
