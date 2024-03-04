import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";

const Inscription = ({ contractSigner, isOpen, setIsOpen, connectwalletHandler }) => {

    const [loading, setLoading] = useState(false);

    async function inscription() {
        try {
            const username = document.getElementById('username')?.value;
            if (!username) return alert('Please enter a username');
            const tx = await contractSigner.inscription(username);
            setLoading(true);
            await tx.wait();
            setLoading(false);
            connectwalletHandler();
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-indigo-800 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl relative overflow-hidden"
                    >
                        <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                        <div className="relative z-10">
                            <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                                <FiAlertCircle />
                            </div>
                            <h3 className="text-3xl font-bold text-center mb-2">
                                Please choose your username
                            </h3>
                            <input id="username" className="w-full rounded-full mb-4 p-2 text-black focus:outline-none" type="text" placeholder="Your username..." />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                >
                                    Nah, go back
                                </button>
                                <button
                                    onClick={inscription}
                                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                >
                                    {loading ? "Creating account..." : "Create my account !"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Inscription;