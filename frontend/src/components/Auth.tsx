import { SignUpParams } from "@anshux1/common";
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: {type: "signup" | "signin"}) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignUpParams>({
    name: "",
    email: "",
    password: ""
  });

  async function sendResponse(){
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs)
      const { jwtToken }= response.data;
      console.log(response);
      localStorage.setItem("token", `Bearer ${jwtToken}`)
      console.log(jwtToken);
      navigate("/blogs")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="pr-3">
            <div className="text-3xl font-extrabold ">
              {type == "signup" ? "Create an account" : "Login"}
            </div>
            <div className="text-slate-500">
              {type == "signup" ? "Already have a account?" : "Don't have a account?" }
              <Link to={type=="signup" ? "/signin" : "/signup"} className="pl-2 underline">{type=="signup" ? "Login" : "Signup"}</Link>
            </div>
          </div>
          <div>
            <LabelledInput label="Email" placeholder="Enter your email" onChange={e => {
              setPostInputs(prev => ({
                ...prev,
                email: e.target.value
              }))
            }} />
            <LabelledInput label="Password" type={"password"} placeholder="Enter your passoword" onChange={e => {
              setPostInputs(prev => ({
                ...prev,
                password: e.target.value
              }))
            }} />
            {type == "signup" && 
            <LabelledInput label="Name" placeholder="Enter your name" onChange={e => {
              setPostInputs(prev => ({
                ...prev,
                name: e.target.value
              }))
            }} />}
            <button onClick={sendResponse} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type == "signup" ? "Create Account" : "Login"}</button>
          </div>
          </div>
      </div>
    </div>
  )
}

interface labelledInput {
  label: string,
  placeholder: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  type?: string
}

function LabelledInput({label, placeholder, onChange, type}: labelledInput ){
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
      <input onChange={onChange} type={ type || "text"} placeholder={placeholder} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
    </div>
  )
}
