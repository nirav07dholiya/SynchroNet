import React, { useEffect } from 'react'
import ReactPlayer from "react-player";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const NetClip = ({contentUrl}) => {
    const { ref, inView } = useInView({ threshold: 0.7 });
  return (
    <motion.div
      ref={ref}
      className="w-full h-screen flex justify-center items-center bg-transparent"
      initial={{ opacity: 0.7  }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.7 }}
    >
      <ReactPlayer
        url={`http://localhost:8747/${contentUrl}`}
        playing={inView}
        loop
        controls={false}
        width={"100%"}
        height={"100%"}
        className="max-w-full max-h-[90%] object-cover"
      />
     </motion.div>
  )
}

export default NetClip