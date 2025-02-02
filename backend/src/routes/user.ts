import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "@nikhilk9350/medium-clone-common";


export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string,
      JWT_SECRET : string
    }
  }>()


userRouter.post('/signup', async (c) => {
    const body = await c.req.json()
    const {success} = signupInput.safeParse(body)
    if(!success) {
        c.status(411)
        return c.json({
            message : "Inputs not correct"
        })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
  
    // console.log(body);
    
    console.log("connected with db successfully....");
    
    try {
      // duplicate email taken care as i have check on db as unique on username
      const user = await prisma.user.create({
        data: {
          name : body.name,
          username : body.username,
          password : body.password
        }
      })
      const jwt = await sign({
        id : user.id, 
      }, c.env.JWT_SECRET)
      return c.text(jwt)
      
    } catch (e) {
      console.log(e);
       
      c.status(411);
      return c.text('Invalid.')
    } 
  
  })

userRouter.post('/signin', async (c) => {
    const body = await c.req.json()
    const {success} = signinInput.safeParse(body)
    if(!success) {
        c.status(411)
        return c.json({
            message : "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
}).$extends(withAccelerate())

// console.log(body);

console.log("connected with db successfully....");

try {
    const user = await prisma.user.findFirst({
    where : {
        username : body.username,
        password : body.password
    }
    })
    if(!user){
    c.status(403);
    return c.json({
        message : "Incorrect credentials"
    })
    }
    const jwt = await sign({
    id : user.id, 
    }, c.env.JWT_SECRET)
    return c.text(jwt)
    
} catch (e) {
    console.log(e);
    
    c.status(411);
    return c.text('Invalid.')
} 

})