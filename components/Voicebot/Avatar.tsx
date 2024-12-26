import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import Button from "../ui/button";
import { Image } from "lucide-react";

const Avatar = ({ isTalking, isThinking, iconImage }: { isTalking: boolean; isThinking: boolean; iconImage?: string }) => {
  const iconImageUrl = iconImage ? iconImage : "https://loosedrawing.com/assets/media/illustrations/png/257.png";
  let avatarClasses = "avatar scroll_up";
  let shadeClasses = "shade show_shadow";

  if (isTalking) {
    avatarClasses += " talking";
    shadeClasses += " talking_shadow";
  } else if (isThinking) {
    avatarClasses += " thinking";
    shadeClasses += " jump_shade";
  }

  const avatarContainerStyles: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const avatarStyles: React.CSSProperties = {
    width: "200px",
    height: "200px",
    margin: "20px auto",
    borderRadius: "50%",
    overflow: "hidden",
    zIndex: "100",
    backgroundColor: "white",
    animation: "morph 4s linear infinite, wave 4s linear infinite",
  };

  const thanksContainerStyles: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: "0",
    visibility: "hidden",
    transition: "opacity 1s ease-out, visibility 1s ease-out",
  };

  const thanksStyles: React.CSSProperties = {
    fontSize: "60px",
    fontFamily: '"Times New Roman", Times, serif',
    color: "#361600",
    textShadow: "2px 1px 2px rgba(0, 0, 0, 0.5)",
  };

  const shadeStyles: React.CSSProperties = {
    position: "absolute",
    bottom: "-17%",
    left: "25%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    filter: "blur(5px)",
    animation: "shadow 4s linear infinite",
  };

  const keyFrames = `
    @keyframes morph {
      0%, 100% {
        border-radius: 42% 58% 60% 40% / 45% 45% 55% 55%;
        transform: translate3d(0, 0, 0) rotateZ(0.01deg);
      }
      34% {
        border-radius: 40% 45% 46% 54% / 53% 43% 51% 40%;
        transform: translate3d(-8px, 5px, 0) rotateZ(0.01deg);
      }
      50% {
        border-radius: 50% 55% 46% 54% / 53% 62% 53% 45%;
        transform: translate3d(-4px, 0, 0) rotateZ(0.01deg);
      }
      82% {
        border-radius: 60% 60% 60% 40% / 60% 50% 40% 50%;
        transform: translate3d(0px, -3px, 0) rotateZ(0.01deg);
      }
    }

    @keyframes shadow {
      0%, 100% {
        transform: scaleX(1);
        opacity: 0.4;
      }
      34% {
        transform: scaleX(1.1) translateX(-8px);
        opacity: 0.6;
      }
      50% {
        transform: scaleX(1.05) translateX(-4px);
        opacity: 0.5;
      }
      82% {
        transform: scaleX(0.9);
        opacity: 0.3;
      }
    }

    @keyframes talking {
      0%, 100% {
        transform: scale(1);
      }
      10% {
        transform: scale(1.08);
      }
      20% {
        transform: scale(1.16);
      }
      30% {
        transform: scale(1.12);
      }
      40% {
        transform: scale(1.2);
      }
      50% {
        transform: scale(1.15);
      }
      60% {
        transform: scale(1.24);
      }
      70% {
        transform: scale(1.2);
      }
      80% {
        transform: scale(1.28);
      }
      90% {
        transform: scale(1.24);
      }
    }

    @keyframes wave {
      0%, 100% {
        border-radius: 50%;
      }
      25% {
        border-radius: 40% 60% 55% 45% / 55% 45% 55% 45%;
      }
      50% {
        border-radius: 55% 45% 50% 50% / 45% 55% 45% 55%;
      }
      75% {
        border-radius: 50% 50% 45% 55% / 60% 40% 60% 40%;
      }
    }

    @keyframes talking_shadow {
      0% {
        width: 100px;
        height: 10px;
        opacity: 0.6;
        filter: blur(5px);
      }
      10% {
        width: 115px;
        height: 11.5px;
        opacity: 0.5;
        filter: blur(5.75px);
      }
      20% {
        width: 130px;
        height: 13px;
        opacity: 0.4;
        filter: blur(6.5px);
      }
      30% {
        width: 120px;
        height: 12px;
        opacity: 0.5;
        filter: blur(6px);
      }
      40% {
        width: 135px;
        height: 13.5px;
        opacity: 0.4;
        filter: blur(6.75px);
      }
      50% {
        width: 125px;
        height: 12.5px;
        opacity: 0.5;
        filter: blur(6.25px);
      }
      60% {
        width: 140px;
        height: 14px;
        opacity: 0.4;
        filter: blur(7px);
      }
      70% {
        width: 130px;
        height: 13px;
        opacity: 0.5;
        filter: blur(6.5px);
      }
      80% {
        width: 145px;
        height: 14.5px;
        opacity: 0.4;
        filter: blur(7.25px);
      }
      90% {
        width: 140px;
        height: 14px;
        opacity: 0.5;
        filter: blur(7px);
      }
      100% {
        width: 100px;
        height: 10px;
        opacity: 0.6;
        filter: blur(5px);
      }
    }

    @keyframes jump_shade {
      0%, 100% {
        width: 100px;
        height: 10px;
        opacity: 0.6;
        filter: blur(5px);
      }
      50% {
        width: 80px;
        height: 8px;
        opacity: 0.3;
        filter: blur(4px);
      }
    }
  `;

  return (
    <div className="avatar-container" style={avatarContainerStyles}>
      <div id="avatar" className={avatarClasses} style={avatarStyles}>
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={iconImageUrl}
              alt="Avatar"
            />
          </DialogTrigger>
          <DialogContent className="w-[90%] md:w-full">
            <DialogHeader>
              <DialogTitle>画像を変更する</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                アバター画像として表示するための画像を選択してください
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid items-center gap-2">
                <div className="flex items-center">
                  <Image className="mr-2" />
                  <label htmlFor="image-upload" className="font-bold">
                    Image
                  </label>
                </div>
                <Input id="image-upload" type="file" />
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end space-x-2">
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Upload</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div
        id="thanks_message_container"
        className="thanks-container"
        style={thanksContainerStyles}
      >
        <h1 id="thanks_message" className="thanks" style={thanksStyles}>
          Thank you
        </h1>
      </div>
      <div id="shade" className={shadeClasses} style={shadeStyles}></div>
      <style>{keyFrames}</style>
    </div>
  );
};

export default Avatar;
