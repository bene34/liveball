import React from 'react'
import Link from 'next/link'

const NavBar = () => {
  return (
    <div className="w-full">
  <div className="navbar bg-base-100">
    <div className="flex justify-between items-center w-full relative">
      <div className="justify-start">
        <a className="btn btn-ghost text-neutral-content text-xl">LiveBall</a>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4">
            <Link href="/ppp">
              <div className="btn btn-ghost text-neutral-content cursor-pointer">Player PPP</div>
            </Link>
        <a className="btn btn-ghost text-neutral-content cursor-pointer">Film</a>
        <a className="btn btn-ghost text-neutral-content cursor-pointer">About</a>
      </div>
    </div>
  </div>
</div>
      
  )
}

export default NavBar
