import { useState } from "react";
import UserCard from "./UserCard";

const SwipeableCard = ({
  user,
  sendRequest,
  zIndex = 1,
  scale = 1,
  topOffset = 0,
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (x, y) => {
    setStart({ x, y });
    setIsDragging(true);
  };
  const handleMove = (x, y) => {
    if (!isDragging || !start) return;
    setOffset({ x: x - start.x, y: y - start.y });
  };
  const handleEnd = () => {
    if (!isDragging) return;
    const threshold = 120;
    if (offset.x > threshold) {
      setOffset({ x: window.innerWidth, y: offset.y });
      sendRequest("interested", user._id);
    } else if (offset.x < -threshold) {
      setOffset({ x: -window.innerWidth, y: offset.y });
      sendRequest("ignored", user._id);
    } else setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setStart(null);
  };

  return (
    <div
      className="absolute w-full max-w-sm h-[500px] touch-none cursor-grab"
      style={{
        left: "50%",
        top: `calc(50% - ${topOffset}px)`, // subtract offset to show top peek
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${
          offset.y
        }px) rotate(${offset.x / 20}deg) scale(${scale})`,
        zIndex: zIndex,
        transition: isDragging
          ? "none"
          : "transform 0.3s ease, top 0.3s ease, scale 0.3s ease",
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) =>
        handleStart(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchMove={(e) =>
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchEnd={handleEnd}>
      <UserCard user={user} sendRequest={sendRequest} />
    </div>
  );
};
export default SwipeableCard;
