import { Box } from '@mui/material';


export default function BackgroundOverlay() {
  return (
    <>
      <Box className='w-full h-full z-[-40]
      fixed bg-neutral-950/80' />

      <Box className='w-full h-full z-[-40]
      fixed bg-sky-950/10' />

      <Box className='w-screen h-dvh z-[-40]
      fixed overflow-hidden pointer-events-none noise opacity-40' />
    </>
  )
}