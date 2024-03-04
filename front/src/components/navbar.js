import { AnimatePresence, motion } from "framer-motion";
import logo from "../logo.png";

const SideNav = ({ defaultAccount, connectwalletHandler, user, selected, setSelected }) => {

    return (
        <nav className="h-screen w-fit bg-slate-950 p-4 flex flex-col justify-between gap-2">
            <div>
                <img className="w-14 h-14 mx-auto" src={logo} alt="logo" />
                <div className="flex flex-col gap-2">
                    <NavItem selected={selected === 0} id={0} setSelected={setSelected}>
                        <p className="whitespace-nowrap">All matches</p>
                    </NavItem>
                    <NavItem selected={selected === 1} id={1} setSelected={setSelected}>
                        <p className="whitespace-nowrap">Your bets</p>
                    </NavItem>
                </div>
            </div>
            <div>
                {user &&
                    <p className="pl-1 italic text-sm">
                        Connected as :
                        <span className="font-semibold"> {user[1]}</span>
                    </p>
                }
                <button
                    className="px-3 py-2 w-48 bg-indigo-800 whitespace-nowrap hover:bg-indigo-700 rounded-md transition-colors relative"
                    onClick={connectwalletHandler}>
                    {defaultAccount ?
                        `${defaultAccount.address.slice(0, 5)}...${defaultAccount.address.slice(defaultAccount.address.length - 5)}`
                        :
                        "Connect wallet"}
                </button>
            </div>
        </nav>
    );
};

const NavItem = ({ children, selected, id, setSelected }) => {
    return (
        <motion.button
            className="px-3 py-2 w-48 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors relative"
            onClick={() => setSelected(id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="block relative z-10">{children}</span>
            <AnimatePresence>
                {selected && (
                    <motion.span
                        className="absolute inset-0 rounded-md bg-indigo-600 z-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    ></motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default SideNav;