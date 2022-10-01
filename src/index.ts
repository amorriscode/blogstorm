import express from 'express'
import { createServer } from '@graphql-yoga/node'
import { useGenericAuth } from '@envelop/generic-auth'

import { schema } from './schema'
import { resolveUser } from './services/auth'

const gqlServer = createServer({
  schema,
  plugins: [
    useGenericAuth({
      resolveUserFn: resolveUser,
      mode: 'protect-all',
    }),
  ],
})

const app = express()
const port = process.env.PORT || 3000
const gqlEndpoint = `/graphql`

app.use(gqlEndpoint, gqlServer)

app.listen(port, () => {
  console.log(`🚀 nAPI ready at http://localhost:${port}${gqlEndpoint}`)
})
