import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export interface BlogInterface {
  id: string,
  title: string,
  content: string,
  author: {
    name: string
  }
}

export const useBLog = ({ id }: { id: string} ) => {
  const [loading, setloading] = useState(true);
  const [blog, setBlog] = useState<BlogInterface>();
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then(response => {
      const { postDetails } = response.data;
      setBlog(postDetails);
      setloading(false);
      console.log(localStorage.getItem('token'))
    })  
  },[])
  return {
    loading,
    blog
  }
}

export const useBlogs = () => {
  const [loading, setloading] = useState(true);
  const [blogs, setBlogs] = useState<BlogInterface[]>([]);
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then(response => {
      const { allPosts } = response.data;
      setBlogs(allPosts);
      setloading(false);
      console.log(localStorage.getItem('token'))
    })  
  },[])
  return {
    loading,
    blogs
  }
}
