import { ResolveUserFn } from '@envelop/generic-auth'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { User } from '@prisma/client'
import { db } from './db'

// TODO: figure out better typing for this
type Context = {
  req: {
    headers: {
      authorization: string
    }
  }
}

export const resolveUser: ResolveUserFn<User, Context> = async (context) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing required JWT_SECRET')
  }

  const token = context.req.headers.authorization.replace('Bearer ', '')

  try {
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET) as { id: string }
    return await db.user.findUnique({ where: { id: jwtUser.id } })
  } catch (e) {
    console.error(`Failed to validate token: ${token}`)
    return null
  }
}

export const generateAccessToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing required JWT_SECRET')
  }

  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    // Keep tokens alive for 90 days
    { expiresIn: '7776000s' }
  )
}

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`)

  return `${salt}:${hash}`
}

export const validatePassword = (user: User, password: string) => {
  const [salt, savedHash] = user.passwordHash.split(':')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`)

  return savedHash === hash
}
