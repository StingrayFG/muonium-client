import React from 'react';
import { Box } from '@mui/material';

import { ReactComponent as Upload } from 'assets/icons/upload.svg'
import { ReactComponent as Download } from 'assets/icons/download.svg'
import { ReactComponent as FilePlus } from 'assets/icons/file-plus.svg'
import { ReactComponent as FileX } from 'assets/icons/file-x.svg'

import { ReactComponent as ClipboardMinus } from 'assets/icons/clipboard2-minus.svg'
import { ReactComponent as Files } from 'assets/icons/files.svg'
import { ReactComponent as Scissors } from 'assets/icons/scissors.svg'
import { ReactComponent as Pencil } from 'assets/icons/pencil.svg'

import { ReactComponent as Trash } from 'assets/icons/trash.svg'
import { ReactComponent as ArrowClockwise } from 'assets/icons/arrow-clockwise.svg'

import { ReactComponent as Gear } from 'assets/icons/gear.svg'


export default function MenuOptionElement ({ option }) {

  const iconStyle = 'h-4 w-4 mt-[8px]';

  const icon = option.icon;

  const getIcon = () => {
    if (icon === 'upload') { return <Upload className={iconStyle}/> } 
    else if (icon === 'download') { return <Download className={iconStyle}/> }
    else if (icon === 'new-folder') { return <FilePlus className={iconStyle}/> } 

    else if (icon === 'add-bookmark') { return <FilePlus className={iconStyle}/> } 
    else if (icon === 'remove-bookmark') { return <FileX className={iconStyle}/> }

    else if (icon === 'copy') { return <Files className={iconStyle}/> }
    else if (icon === 'cut') { return <Scissors className={iconStyle}/> }
    else if (icon === 'paste') { return <ClipboardMinus className={iconStyle}/> } 
    else if (icon === 'rename') { return <Pencil className={iconStyle}/> }

    else if (icon === 'trash') { return <Trash className={iconStyle}/> }
    else if (icon === 'recover') { return <ArrowClockwise className={iconStyle}/> }

    else if (icon === 'settings') { return <Gear className={iconStyle}/> }

    else { return <Box className={iconStyle}/> } 
  }


  return (
    <button className={`w-full h-8 px-2 flex 
    button-menu
    active:button-menu-active`}
    onClick={option.handleOnClick}>

      <Box className='shrink-0'>
        {getIcon()}
      </Box>

      <p className='ml-2 place-self-center
      text-left text-ellipsis overflow-hidden'>
        {option.text}
      </p>

    </button> 
  );
}
