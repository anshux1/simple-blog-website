import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signInInput, signUpInput } from "@anshux1/common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

userRouter.post('/signup', async (c) => {
  const { user } = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const { success } = signUpInput.safeParse(body)
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs are incorrect"
      })
    }
    const newUser = await user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body?.name
      }
    })

    const jwtToken = await sign({ id: newUser.id }, c.env.JWT_SECRET)

    return c.json({
      message: "Account created succesfully",
      jwtToken
    }, 200)
  } catch (error) {
    return c.text("Error while creating account")
  }
})

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = signInInput.safeParse(body)
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs are incorrect"
      })
    }
    const userExist = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      }
    })
    if(userExist){
      const jwtToken = await sign({ id: userExist.id }, c.env.JWT_SECRET);
      return c.json({
        message: "Login succesfully",
        jwtToken
      })
    } else {
      return c.json({
        message: "User not found"
      },403)
    }
  } catch (error) {
    return c.text("Error: Try again later")
  }
})
