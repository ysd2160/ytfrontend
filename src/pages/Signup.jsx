import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils'

const Signup = () => {
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        fullname: "",
    })
    const [file, setFile] = useState({
        avatar: null,
        coverImage: null
    })
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleFileChange = (e) => {
        setFile({ ...file, [e.target.name]: e.target.files[0] })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData()
            formData.append("username", data.username)
            formData.append("email", data.email)
            formData.append("password", data.password)
            formData.append("fullName", data.fullname)
            if (file.avatar) formData.append("avatar", file.avatar)
            if (file.coverImage) formData.append("coverImage", file.coverImage)
            const response = await axios.post(`${api}/api/v1/user/register`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
            console.log(response);

        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-center text-3xl font-bold font-mono mb-8">
                    Register
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="flex flex-col">
                        <label htmlFor="username" className="mb-1 text-gray-700 font-medium">Username</label>
                        <input
                            className="border border-gray-300 shadow-sm rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={data.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 text-gray-700 font-medium">Email</label>
                        <input
                            className="border border-gray-300 shadow-sm rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                            name="email"
                            placeholder="Enter email"
                             value={data.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 text-gray-700 font-medium">Password</label>
                        <input
                            className="border border-gray-300 shadow-sm rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                             value={data.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col">
                        <label htmlFor="fullname" className="mb-1 text-gray-700 font-medium">Full Name</label>
                        <input
                            className="border border-gray-300 shadow-sm rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="fullname"
                            placeholder="Enter full name"
                             value={data.fullname}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Profile Upload */}
                    <div className="flex flex-col">
                        <label htmlFor="file" className="mb-1 text-gray-700 font-medium">Profile Picture</label>
                        <input
                            id="file"
                            type="file"
                            name="avatar"
                             
                            onChange={handleFileChange}
                            className="border border-gray-300 shadow-sm rounded-md p-2 outline-none
                            file:bg-amber-400 file:text-white 
                            hover:file:bg-amber-500 cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="file" className="mb-1 text-gray-700 font-medium">Cover Image</label>
                        <input
                            id="file"
                            type="file"
                            name="coverImage"
                            onChange={handleFileChange}

                            className="border border-gray-300 shadow-sm rounded-md p-2 outline-none
                            file:bg-amber-400 file:text-white 
                            hover:file:bg-amber-500 cursor-pointer"
                        />
                    </div>

                    {/* Submit Button */}
                    <span>Already have a account ? <Link to={"/login"}> <span className='font-mono text-blue-500' >login</span> </Link></span>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 rounded-md p-2 text-white w-full font-medium transition"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Signup
