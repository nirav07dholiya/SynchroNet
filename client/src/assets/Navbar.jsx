import React, { useState } from "react";
import { IoIosHome } from "react-icons/io";
import { MdOutlineAddBox } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { AiOutlineSave } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { LOGOUT_ROUTE } from "@/utils/constant";
import { apiClient } from "@/lib/api-client";
import { PiFileVideo } from "react-icons/pi";
import useAppStore from "@/store";

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  useState(() => {
    // console.log("navbar");
    // console.log({ userInfo });
  }, []);

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status == 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-[100vw] h-[10vh] md:h-[92vh] md:w-[18vw]  border-gray-500/50 border-t-2  md:border-r-2 md:border-t-0 flex justify-between items-center bg-black flex-col dark:bg-white dark:text-black ">
        <div className="flex justify-evenly items-end md:flex-col w-auto h-[7vh] md:h-auto md:w-[15vw] gap-1 my-4">
          <NavLink
            to="/home"
            className="h-full w-[17vw] flex flex-col justify-center items-center md:w-full md:h-[6vh] md:flex-row md:justify-start md:pl-6 md:items-center  md:gap-5 text-white hover:bg-gray-500/25 rounded-md dark:text-black"
          >
            <div className="flex md:items-center lg:items-center justify-center md:w-10 md:h-8">
              <IoIosHome className="text-[25px] md:text-[20px]" />
            </div>
            <p className="md:w-[7vw] flex items-center text-[12px] md:text-[17px] md:h-full">
              Home
            </p>
          </NavLink>
          <NavLink
            to="/search"
            className="h-[7vh] w-[17vw] flex flex-col justify-center items-center md:w-full md:h-[6vh] md:flex-row md:justify-start md:pl-6 md:items-center  md:gap-5 text-white hover:bg-gray-500/25 rounded-md dark:text-black"
          >
            <div className="flex md:items-center lg:items-center justify-center md:w-10 md:h-8">
              <IoSearch className="text-[25px] md:text-[20px]" />
            </div>
            <p className="md:w-[7vw] flex items-center text-[12px] md:text-[17px] md:h-full">
              Search
            </p>
          </NavLink>
          <NavLink
            to="/add-post"
            className="h-full w-[17vw] flex flex-col justify-center items-center md:w-full md:h-[6vh] md:flex-row md:justify-start md:pl-6 md:items-center md:gap-5 text-white hover:bg-gray-500/25 rounded-md  dark:text-black"
          >
            <div className="flex md:items-center lg:items-center justify-center md:w-10 md:h-8">
              <MdOutlineAddBox className="text-[25px] md:text-[23px]" />
            </div>
            <p className=" md:w-[7vw] flex items-center text-[12px] md:text-[17px] md:h-full ">
              Add
            </p>
          </NavLink>
          <NavLink
            to="/net-clips"
            className="h-full w-[17vw] flex flex-col justify-center items-center md:w-full md:h-[6vh] md:flex-row md:justify-start md:pl-6 md:items-center md:gap-5 text-white hover:bg-gray-500/25 rounded-md  dark:text-black"
          >
            <div className="flex md:items-center lg:items-center justify-center md:w-10 md:h-8">
              <PiFileVideo className="text-[25px] md:text-[23px]" />
            </div>
            <p className=" md:w-[7vw] flex items-center text-[12px] md:text-[17px] md:h-full ">
              NetClips
            </p>
          </NavLink>
          <NavLink
            to="/profile"
            className="h-full w-[17vw] flex flex-col justify-center items-center md:w-full md:h-[6vh] md:flex-row md:justify-start md:pl-6 md:items-center md:gap-5 text-white hover:bg-gray-500/25 rounded-md dark:text-black"
          >
            <div className="flex md:items-center lg:items-center justify-center md:w-10 md:h-8">
              {userInfo.DP ? (
                <div className="w-[27px] h-[27px] border-white dark:border-black border-2 rounded-full flex items-center justify-center">
                  <img
                    src={`http://localhost:8747/${userInfo.DP}`}
                    alt=""
                    className="rounded-full h-[21px] w-[21px]"
                  />
                </div>
              ) : (
                <CgProfile className="text-[25px] md:text-[22px]" />
              )}
            </div>
            <p className="md:w-[7vw] flex items-center text-[12px] md:text-[17px] md:h-full">
              Profile
            </p>
          </NavLink>
          <NavLink
            to="/saved"
            className="hidden md:flex md:w-full md:h-[6vh] md:flex-row md:justify-start md:pl-6 md:items-center md:gap-5 text-white hover:bg-gray-500/25 rounded-md dark:text-black"
          >
            <div className="flex md:items-center lg:items-center justify-center md:w-10 md:h-8">
              <AiOutlineSave className="text-[25px] md:text-[22px]" />
            </div>
            <p className="md:w-[7vw] flex items-center text-[12px] md:text-[17px] md:h-full">
              Saved{" "}
            </p>
          </NavLink>
        </div>
        <div
          className="md:w-full md:h-12 text-white hidden md:flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-500/25 dark:text-black  border-white "
          onClick={logOut}
        >
          <div className="flex md:items-center lg:items-center justify-center md:w-10 md:h-8">
            <TbLogout2 className="text-[25px] md:text-[22px]" />
          </div>
          <p className="md:w-[7vw] flex items-center text-[12px] md:text-[17px] md:h-full">
            Logout
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
