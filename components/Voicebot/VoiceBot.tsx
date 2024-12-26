"use client";
import React, { useEffect, useRef, useState } from "react";
import useAudioPlayer from "./useAudioPlayer";
import Avatar from "./Avatar";
import { useSetAtom } from "jotai";
import { audioMenuIdAtom } from "@/store/atom";
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { LuSubtitles } from "react-icons/lu";
import { RiQuestionnaireLine } from "react-icons/ri";
import { motion } from "framer-motion";

const CallCenter = () => {
  const [voiceBotStatus, setVoiceBotStatus] = useState("");
  const [vadStatus, setVadStatus] = useState("");
  const [transcript, setTranscript] = useState(
    "実際に話せます。通話ボタンを押してみてください。"
  );
  const [relatedKnowledge, setRelatedKnowlede] = useState("");
  const [log, setLog] = useState("");
  const [tool, setTool] = useState("");
  const setAudioMenuId = useSetAtom(audioMenuIdAtom);
  const [isCalling, setIsCalling] = useState(false);

  const onClose = () => {
    // webcosktが閉じた時の処理
    setIsCalling(false);
  };

  const onResponse = (type: string, content: any) => {
    if (type === "status") {
      setVoiceBotStatus(content.status);
      // updateAvatarAndShadow(content.status === 'THINKING' && isPlaying, content.status === 'THINKING' && !isPlaying);
    } else if (type === "vad") {
      setVadStatus(content.status);
    } else if (type === "user") {
      setTranscript(content.text);
    } else if (type === "log") {
      const currentDate = new Date();
      const timestamp =
        currentDate.getHours() +
        ":" +
        currentDate.getMinutes() +
        ":" +
        currentDate.getSeconds();
      setLog((prevLog) => prevLog + timestamp + " - " + content.log + "\n");
    } else if (type === "rag") {
      setRelatedKnowlede(content.text);
    } else if (type === "tool") {
      setTool(`${content.name} ${JSON.stringify(content.arguments)}`);

      if (content.name === "select_menu") {
        const frame = document.getElementById(
          "menu-" + content.arguments.menu_id
        );
        frame!.style.border = "2px solid #f00";
        frame!.style.borderRadius = "10px";
        frame!.style.transition = "0.3s";
        frame!.style.transform = "scale(1.1)";
        frame!.style.filter = "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))";

        // TODO:globalStateで管理するためのフックス呼ぶ
        setAudioMenuId(content.arguments.menu_id);

        setTimeout(() => {
          frame!.style.border = "1px solid #ccc";
          frame!.style.boxShadow = "none";
          frame!.style.transform = "none";
          frame!.style.filter = "none";
        }, 3000);
      }
    } else if (type === "pause") {
      interrupt()
    }
  };

  const { isPlaying, stop, start, interrupt } = useAudioPlayer(onClose, onResponse);

  const handleStopClick = () => {
    stop();
    setIsCalling(false);
  };

  const handleStartClick = async () => {
    start();
    setIsCalling(true);
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-md md:text-lg font-bold flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center">
          <LuSubtitles size={30} />
          <p className="ml-2 underline decoration-[0.5em] decoration-[rgba(255,228,0,0.4)] underline-offset-[-0.2em] decoration-slice">
            {transcript}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          {relatedKnowledge}
        </p>
      </motion.div>
      <div>
        <Avatar
          isThinking={voiceBotStatus === "THINKING" && isPlaying}
          isTalking={voiceBotStatus === "TALKING" && isPlaying}
        />
      </div>

      <div className="mt-12  flex justify-center">
        {!isCalling && (
          <button
            onClick={handleStartClick}
            className="relative mx-2 inline-flex items-center justify-center p-3 bg-green-500 rounded-full shadow-md"
          >
            <IoIosCall size={32} color="white" />
          </button>
        )}
        {isCalling && (
          <button
            onClick={handleStopClick}
            className="relative mx-2 inline-flex items-center justify-center p-3 bg-red-500 rounded-full shadow-md"
          >
            <MdCallEnd size={32} color="white" />
          </button>
        )}
        <button
          onClick={() => {
            window.location.href = `/dashboard`
          }}
          className="relative mx-2 inline-flex items-center justify-center p-3 px-6 bg-blue-500 rounded-full shadow-md text-white text-lg font-bold"
        >
          自分の設定で試す
        </button>
      </div>
      <div className="mt-8">
        <motion.div
          className="flex items-center justify-center m-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <RiQuestionnaireLine size={28} />
          <p className="mx-2 font-bold">こんな質問をしてね!</p>
        </motion.div>
        <div className="mt-2 grid md:grid-cols-3 md:gap-4 grid-cols-1 justify-items-center md:justify-items-start items-center">
          <motion.div
            id="menu-1"
            className="relative max-w-sm bg-white shadow-lg rounded-lg p-6 mb-4"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "backOut" }}
          >
            <p className="text-gray-600 font-bold">
              自社サイトに埋め込みはどうやるの？
            </p>
            <div className="absolute -bottom-[10px] right-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-white transform rotate-45 translate-x-1/2"></div>
            </div>
          </motion.div>
          <motion.div
            id="menu-2"
            className="relative max-w-sm bg-white shadow-lg rounded-lg p-6 mb-4"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "backOut" }}
          >
            <p className="text-gray-600 font-bold">
              会話できるAIキャラクターを作りたい
            </p>
            <div className="absolute -bottom-[10px] right-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-white transform rotate-45 translate-x-1/2"></div>
            </div>
          </motion.div>
          <motion.div
            id="menu-3"
            className="relative max-w-sm bg-white shadow-lg rounded-lg p-6 mb-4"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1.1, ease: "backOut" }}
          >
            <p className="text-gray-600 font-bold">
              コールセンターへの導入に興味がある
            </p>
            <div className="absolute -bottom-[10px] right-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-white transform rotate-45 translate-x-1/2"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CallCenter;
