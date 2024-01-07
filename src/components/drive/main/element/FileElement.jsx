import React from "react";

export default function FileElement ({ file, handleContextMenuClick }) {
  return (
    <div className='w-full h-full grid place-self-center
    border-solid border-0 border-black'>
      <div className='w-48 h-48 place-self-center grid
      border-solid border-0 border-black rounded-lg' 
      onContextMenu={(event) => {handleContextMenuClick(event, file)}}>
        <div className='w-36 h-48 place-self-center
        bg-gradient-to-b from-neutral-300 to-neutral-400
        border-solid border-2 border-neutral-400 rounded-lg'>
        </div>

      </div>
      <p className='place-self-center text-center'>
        {file.name}
      </p>
    </div>
  );
}
