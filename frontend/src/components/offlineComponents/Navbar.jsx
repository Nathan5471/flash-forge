import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="flex flex-row h-[calc(10%)] w-full bg-gray-700 items-center justify-between p-2">
            <Link to="/downloads" className="text-white text-3xl hover:text-gray-300 font-bold">Flash Forge</Link>
            <div className="flex flex-row gap-2">
                <Link to="/" className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">Online</Link>    
            </div>     
        </div>
    )
}