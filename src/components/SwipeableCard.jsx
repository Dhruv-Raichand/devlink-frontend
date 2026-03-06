import { useState } from "react";
import UserCard from "./UserCard";

const SwipeableCard = ({
  user,
  sendRequest,
  zIndex = 1,
  scale = 1,
  topOffset = 0,
  disabled,
  isTop,
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (x, y) => {
    if (!isTop || disabled) return;
    setStart({ x, y });
    setIsDragging(true);
  };
  const handleMove = (x, y) => {
    if (!isDragging || !start) return;
    const deltaX = x - start.x;
    const deltaY = y - start.y;

    // restrict vertical movement
    setOffset({
      x: deltaX,
      y: Math.max(Math.min(deltaY, 40), -40), // clamp Y
    });

    // setOffset({ x: x - start.x, y: y - start.y });
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
      className={`absolute w-full max-w-sm h-[500px] touch-none ${isTop ? "cursor-grab" : "cursor-default pointer-events-none"}`}
      // className="absolute w-full max-w-sm h-[500px] touch-none cursor-grab"
      style={{
        left: "50%",
        top: `calc(50% - ${topOffset}px)`,
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)
              rotate(${Math.max(Math.min(offset.x / 25, 8), -8)}deg)
              scale(${scale})`,
        zIndex,
        transition:
          isDragging ? "none" : (
            "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
          ),
        boxShadow:
          scale < 1 ?
            "0 10px 30px rgba(0,0,0,0.12)"
          : "0 20px 40px rgba(0,0,0,0.18)",
        willChange: "transform",
      }}
      //       style={{
      //         left: "50%",
      //         top: `calc(50% - ${topOffset}px)`, // subtract offset to show top peek
      //         transform: `translate(-50%, -50%) translate(${offset.x}px, ${
      //           offset.y
      //         }px) rotate(${Math.max(Math.min(offset.x / 25, 8), -8)}deg)
      // `,
      //         // rotate(${offset.x / 20}deg) scale(${scale})
      //         zIndex: zIndex,
      //         transition:
      //           isDragging ? "none" : (
      //             "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
      //           ),
      //         opacity: `scale(${scale})`,
      //         boxShadow:
      //           scale < 1 ?
      //             "0 10px 30px rgba(0,0,0,0.12)"
      //           : "0 20px 40px rgba(0,0,0,0.18)",
      //       }}
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
      <UserCard user={user} sendRequest={sendRequest} disabled={disabled} />
      {offset.x > 90 && (
        <div
          className="absolute top-6 right-6
               px-3 py-1.5
               rounded-full
               border border-emerald-500
               bg-emerald-50
               text-emerald-700
               text-[11px] font-semibold tracking-wide
               select-none pointer-events-none"
          style={{
            opacity: Math.min(offset.x / 140, 1),
          }}>
          INTERESTED
        </div>
      )}

      {offset.x < -90 && (
        <div
          className="absolute top-6 left-6
               px-3 py-1.5
               rounded-full
               border border-rose-500
               bg-rose-50
               text-rose-700
               text-[11px] font-semibold tracking-wide
               select-none pointer-events-none"
          style={{
            opacity: Math.min(Math.abs(offset.x) / 140, 1),
          }}>
          IGNORE
        </div>
      )}
    </div>
  );
};
export default SwipeableCard;
