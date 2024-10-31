import { SignupInput, SigninInput } from "@nikhilk9350/medium-clone-common"
import axios from "axios"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config.ts"

export const Auth = ({type} : {type : "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [signupInput, setSignupInput] = useState<SignupInput>({
        name : "",
        username : "",
        password : ""
    })
    const [signinInput, setSigninInput] = useState<SigninInput>({
        username : "",
        password : ""
    })

    async function sendRequest () {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, type === "signup" ? signupInput : signinInput)
            const jwt = response.data;
            console.log(jwt);
            
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (e) {
            
        }
    }

    
    return (
        <div className="flex justify-center flex-col h-screen">
            <div className="flex justify-center">
                <div>
                    <div className="px-16">
                        <div className="text-3xl font-extrabold">
                            {type === "signup" ? "Create an account" : "Enter Credentials"}
                        </div>
                        <div className="text-slate-400 text-center">
                            {type === "signup" ? "Already have an account? " : "Don't have an account? "} <Link className="underline" to={type === "signup" ? "/signin" : "/signup"}> {type === "signup" ? "Login": "Sign up"} </Link> 
                        </div>
                    </div>
                    <div className="pt-6">
                        {type === "signup" ? <LabelledInput label="Name" placeholder="John Doe.." onChange={(e) => {
                            setSignupInput({
                                ...signupInput,  /// spread out previous values
                                name : e.target.value
                            })
                        }} /> : ""}

                        {type === "signup" ? <LabelledInput label="username" placeholder="John@gmail.com" onChange={(e) => {
                            setSignupInput({
                                ...signupInput,  /// spread out previous values
                                username : e.target.value
                            })
                        }} /> :
                        <LabelledInput label="username" placeholder="John@gmail.com" onChange={(e) => {
                            setSigninInput({
                                ...signinInput,  /// spread out previous values
                                username : e.target.value
                            })
                        }} />
                        }
                        {type === "signup" ? <LabelledInput label="Password" type={"password"} placeholder="12334567" onChange={(e) => {
                            setSignupInput({
                                ...signupInput,  /// spread out previous values
                                password : e.target.value
                            })
                        }} /> :
                        <LabelledInput label="Password" type={"password"} placeholder="John@gmail.com" onChange={(e) => {
                            setSigninInput({
                                ...signinInput,  /// spread out previous values
                                password : e.target.value
                            })
                        }} />
                        }
                    </div>    
                    <button onClick={sendRequest} type="button" className="mt-2 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signin" ? "Sign in" : "Sign up"}</button>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label : string,
    placeholder : string,
    onChange : (e : ChangeEvent<HTMLInputElement>) => void,
    type? : string
}

function LabelledInput({label, placeholder,onChange,type} : LabelledInputType) {
    return(
            <div className="pb-4">
                <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">{label}</label>
                <input onChange={onChange} type={type || "text"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
            </div>
    )
}