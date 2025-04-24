import React, { useRef, useState } from "react";
import Header from "@/assets/Header";
import Navbar from "@/assets/Navbar";
import { IoIosAddCircleOutline } from "react-icons/io";
import useAppStore from "@/store";
import { FaTrash } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  POST_DATA,
  POSTS_UPLOAD_ROUTE,
  REMOVE_POST_IMAGE_ROUTE,
} from "@/utils/constant";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const navigate = useNavigate();
  const inputeImageRef = useRef();
  const { userPost, setUserPost, userInfo, setUserInfo } = useAppStore();
  const [hovered, setHovered] = useState(false);
  const [caption, setCaption] = useState("");
  const [post, setPost] = useState("");
  const [type, setType] = useState("");

  const handleImageInputClick = () => {
    inputeImageRef.current.click();
  };

  const handlePostUpload = async (event) => {
    // console.log("hello");
    const posts = event.target.files[0];
    if (posts) {
      const formData = new FormData();
      formData.append("posts", posts);
      // console.log("post");
      const response = await apiClient.post(POSTS_UPLOAD_ROUTE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response);
      if (response.status == 200 && response.data.post) {
        setUserPost({
          ...userPost,
          contentUrl: response.data.post.contentUrl,
          id: response.data.post.id,
          postType:response.data.post.postType, 
        });
        setPost(`http://localhost:8747/${response.data.post.contentUrl}`);
        toast.success("Post upload successfully.");
      }
    }
  };

  const handleCaptionPost = async () => {
    if (post) {
      let cap = caption;
      // console.log(cap);
      const response = await apiClient.post(
        POST_DATA,
        { cap },
        { withCredentials: true }
      );
      // console.log(response);
      if (response.status == 200 && response.data.post)
        setUserPost({ ...userPost, caption: response.data.post.caption });
      toast.success("Post upload successfully.");
      navigate("/profile");
    } else {
      toast.error("Image required for post.");
    }
  };

  const handleImageDelete = async () => {
    try {
      // console.log({ userPost });
      const response = await apiClient.delete(REMOVE_POST_IMAGE_ROUTE, {
        withCredentials: true,
      });
      // console.log({ response: response });
      if (response.status === 200) {
        setUserPost({ ...userPost, contentUrl: null });
        toast.success("Image removed successfully.");
        setPost("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start">
        <Header />
        <div className="flex flex-col-reverse md:flex-row justify-center items-center w-full h-[92vh] ">
          <Navbar />
          <div className="w-full h-[82vh] md:w-[82vw] md:h-[92vh] flex justify-center items-start bg-black/95 dark:bg-gray-100/95">
            <div className=" w-[100vw] md:w-[60vw] lg:w-[35vw] h-full bg-black flex flex-col dark:bg-white">
              <div className="w-full h-[80%] flex items-center justify-center ">
                <div
                  className=" w-[60%] h-[90%] relative border-dashed border-2 border-white/40 dark:border-black/40 rounded-xl cursor-pointer flex flex-col items-center justify-center overflow-hidden"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  {post ? (
                    <>
                      {userPost.postType == "video" ? (
                        <video className="absolute w-full bg-black dark:bg-white p-2"  autoPlay muted loop preload="metadata">
                          <source
                            src={post}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <img
                          src={post}
                          alt=""
                          className="absolute w-full bg-black p-2 dark:bg-white"
                        />
                      )}
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center bg-gray-700/20 rounded-xl"
                      onClick={post ? handleImageDelete : handleImageInputClick}
                    >
                      <IoIosAddCircleOutline className="text-[150px] text-white/70 dark:text-black/70" />
                      <div className="w-[80%]  h-12 flex items-center justify-center text-[20px] text-center text-white/70 dark:text-black/70 ">
                        Click here to upload image
                      </div>
                    </div>
                  )}
                  {hovered && post && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
                      onClick={post ? handleImageDelete : handleImageInputClick}
                    >
                      <FaTrash className="text-white text-3xl cursor-pointer dark:text-black" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={inputeImageRef}
                    className="hidden"
                    name="post-upload"
                    accept="image/*, video/*"
                    // .png, .jpg, .jpeg, .svg, .webp,
                    onChange={(e) => handlePostUpload(e)}
                  />
                </div>
              </div>
              <div className="w-full h-[20%] flex items-center justify-center gap-2 px-8 border-t-[.3px] border-gray-400/30 dark:border-black/30">
                <Textarea
                  className="bg-gray-600/20 max-h-[14vh] text-white/70 border-none dark:text-black/70"
                  placeholder="Caption for post..."
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Button
                  className="h-[10vh] bg-white/85 text-black hover:bg-white/75 dark:bg-black/15 dark:hover:bg-black/10 dark:text-black/70"
                  onClick={handleCaptionPost}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPost;
