import React, { useState, useEffect } from "react";

export default function FileElement ({ file, handleContextMenuClick }) {
  return (
    <div className='w-full h-full grid place-self-center
    border-solid border-2 border-black' onContextMenu={(event) => {handleContextMenuClick(event, file)}}>
      <div className='w-48 h-48 border-solid border-2 border-white rounded-tr-3xl place-self-center'>
        FILE
      </div>
      <p className='place-self-center text-center'>
        {file.name}
      </p>
    </div>
  );
}