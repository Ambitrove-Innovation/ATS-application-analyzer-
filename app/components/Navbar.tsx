import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar lg:mask-b-from-10  md:border-t-1 border-black">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient uppercase ">Resumind</p>
      </Link>
      <Link to="/upload">
        <p className="primary-button w-fit capitalize transition-all duration-500 ease-in-out hover:scale-105 ">
          Upload Resume
        </p>
      </Link>
    </nav>
  );
};

export default Navbar;
