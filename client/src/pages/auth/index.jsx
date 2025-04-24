import React, { useState } from "react";
import Header from "../../assets/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Victory from "../../assets/images/victory.png";
import { toast, Toaster } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGN_UP_ROUTE } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import useAppStore from "@/store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Auth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [idType, setIdType] = useState("public");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function isValidEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validateAuth = () => {
        if (!email.length) {
            // console.log("email");
            toast.error("Email is required.");
            return false;
        }
        if (!isValidEmail()) {
            // console.log("email");
            toast.error("Email is invalid.");
            return false;
        }
        
        if (!password.length) {
            toast.error("Password is required.");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateAuth()) {
            try {
                const response = await apiClient.post(
                    LOGIN_ROUTE,
                    { email, password },
                    { withCredentials: true }
                );
                // console.log(response);
                if (response.status == 200) {
                    setUserInfo(response.data.user);
                    if (response.data.user.profileSetUp) {
                        navigate("/home");
                    } else {
                        navigate("/profile");
                    }
                }
            } catch (error) {
                // console.log("hello");
                toast.error("User is not found.");
            }
            setEmail("");
            setPassword("");
        }
    };

    const handleSignUp = async () => {
        if (validateAuth()) {
            if (password !== confirmPassword) {
                toast.error("Confirm password doesn't match with password.");
                return false;
            }

            try {
                const response = await apiClient.post(
                    SIGN_UP_ROUTE,
                    { email, password, idType },
                    { withCredentials: true }
                );
                // console.log(response);

                if (response.status == 201) {
                    setUserInfo(response.data.user);
                    // console.log("hello");
                    navigate("/profile");
                }
            } catch (error) {
                console.log({ error });
            }
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    };

    const handleChange=(e)=>{
        // console.log(e.target.value);
        setIdType(e.target.value)
    }

    return (
        <>
            <div className="w-[100vw] h-[100vh] flex flex-col bg-black">
                <Header />
                <div className="w-[100vw] h-[92vh] flex flex-col-reverse md:flex md:flex-row items-center justify-center bg-dark dark:bg-white">
                    <div className="w-[40vh] md:w-[50vh] h-[67%] md:h-[65vh] border-2 flex items-center justify-start rounded-lg flex-col flex-wrap lg:h-[62vh] shadow-purple-500 shadow-3xl border-gray-500">
                        <div className="relative w-full h-[22%] flex items-center justify-center gap-0 flex-col spac">
                            <div className="w-full h-[90%] flex items-center justify-center gap-2">
                                <p className="text-[40px] text-white dark:text-black">Welcome</p>
                                <img src={Victory} className="h-[70%]" />
                            </div>

                            <p className="text-white dark:text-black absolute bottom-0 font-serif tracking-wider text-[12px]">
                                to SynchroNet
                            </p>
                        </div>
                        <hr className="w-[80%] bg-gray-100/5     h-[1px] mt-5" />
                        <div className="flex w-full h-[60%] items-start  justify-center flex-wrap mt-2">
                            <Tabs defaultValue="login" className="w-3/4">
                                <TabsList className="bg-transparant w-full rounded-none ">
                                    <TabsTrigger
                                        value="login"
                                        className="data-[state=active]:bg-transparent text-white text-opacity-90 border-b-2 rounded-none w-full dark:text-black data-[state=active]:text-white data-[state=active]:fonts-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                    >
                                        Login
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="signup"
                                        className="data-[state=active]:bg-transparent text-white text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:fonts-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 dark:text-black "
                                    >
                                        Sign Up
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="login" className="flex flex-col gap-3 mt-5">
                                    <Input
                                        type="text"
                                        value={email}
                                        placeholder="email"
                                        className="rounded-xl p-5 border-gray-300 "
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        value={password}
                                        placeholder="password"
                                        className="rounded-xl p-5 border-gray-300"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button
                                        className="rounded-xl p-6 text-white bg-purple-500 hover:bg-purple-700"
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </Button>
                                </TabsContent>
                                <TabsContent value="signup" className="flex flex-col gap-3">
                                    <Input
                                        type="text"
                                        value={email}
                                        placeholder="email"
                                        className="rounded-xl p-5 border-gray-300"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        value={password}
                                        placeholder="password"
                                        className="rounded-xl p-5 border-gray-300"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        placeholder="confirm password"
                                        className="rounded-xl p-5 border-gray-300"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <div className="flex gap-4 ">

                                        
                                        <div class="flex items-center">
                                            <input
                                                checked
                                                id="default-radio-2"
                                                type="radio"
                                                value="public"
                                                name="default-radio"
                                                onClick={(e)=>handleChange(e)}
                                                class="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300"
                                            />
                                            <label
                                                for="default-radio-2"
                                                class="ms-2 text-sm font-medium text-white cursor-pointer dark:text-black"
                                            >
                                                public
                                            </label>
                                        </div>
                                        <div class="flex items-center">
                                            <input
                                                id="default-radio-1"
                                                type="radio"
                                                value="private"
                                                name="default-radio"
                                                class="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300"
                                                onClick={(e)=>handleChange(e)}
                                            
                                            />
                                            <label
                                                for="default-radio-1"
                                                class="ms-2 text-sm font-medium text-white cursor-pointer dark:text-black"
                                            >
                                                private
                                            </label>
                                        </div>
                                    </div>
                                    <Button
                                        className="rounded-xl p-6 text-white bg-purple-500 hover:bg-purple-700"
                                        onClick={handleSignUp}
                                    >
                                        Sign up
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Auth;
