import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()

app.use('/api/*', cors())
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter)



export default app

// hono syntax --> very similar to express
// hono is the library which works in cloudware workers express doesn't
