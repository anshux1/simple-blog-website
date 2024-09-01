import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@anshux1/common";
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }
}>();

blogRouter.use('/*', async (c, next) => {
  try {
    const header = c.req.header("Authorization") || "";
    const token = header.split(" ")[1];
      const response = await verify(token, c.env.JWT_SECRET);
      if(response.id) {
        c.set("userId", String(response.id));
        await next();
      } else return c.json({
        message: "unauthorized"
      }, 403);
  } catch (error) {
    return c.json({
      message: "Error: Try again later"
    }, 403)
  }
})

blogRouter.post('/', async (c) => {
  const { post } = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  try {
    const userId = c.get("userId")
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body)
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs are incorrect"
      })
    }
    const newBlog = await post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      }
    })
    return c.json({
      id: newBlog.id
    })
  } catch (error) {
    console.log(error);
    return c.text("Error while creating blog")
  }
})

blogRouter.put('/', async (c) => {
  const { post } = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body)
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs are incorrect"
      })
    }
    await post.update({
      where:{
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content
      }
    })
    return c.text("Blog updated successfully")
  } catch (error) {
    console.log(error);
    return c.text("Error while updating blog")
  }
})

blogRouter.get('/bulk', async (c) => {
  const { post } = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  try {
    const allPosts = await post.findMany();
    return c.json({ allPosts })
  } catch (error) {
    console.log(error);
    return c.text("Error while updating blog")
  }
})

// pagination
blogRouter.get('/:id', async (c) => {
  const { post } = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  try {
    const id = c.req.param("id");
    const postDetails = await post.findUnique({
      where:{
        id
      }
    })
    return c.json({ postDetails })
  } catch (error) {
    console.log(error);
    c.status(411);
    return c.text("Error while getting blog")
  }
})
