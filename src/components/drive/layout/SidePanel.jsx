import { Link } from "react-router-dom";

export default function SidePanel () {
  return (
    <div className='w-96 h-full
      text-2xl text-neutral-200
      bg-neutral-600
      border-solid border-r-2 border-black'>

        <Link className='w-[22rem] ml-4 mt-4 px-2 py-2 flex 
        hover:bg-cyan-900 active:bg-cyan-800'
        to='/drive/home'>
          <p>Home</p>
        </Link>

        <Link className='w-[22rem] ml-4 px-2 py-2 flex 
        hover:bg-cyan-900 active:bg-cyan-800'
        to='/drive/trash'>
          <p>Trash</p>
        </Link>
    </div>
  );
}