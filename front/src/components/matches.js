import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Matches = ({ contractProvider, contractSigner, connectwalletHandler }) => {
    const [matches, setMatches] = useState([]);
    const [isOpen, setIsOpen] = useState(-1);
    const [loading, setLoading] = useState(false);

    async function bet() {
        const score1 = document.getElementById("score1")?.value;
        const score2 = document.getElementById("score2")?.value;
        if (!score1 || !score2) {
            alert("Please fill the scores");
            return;
        }
        if (isOpen === -1) return;
        try {
            const tx = await contractSigner.bet(isOpen, score1, score2);
            setLoading(true);
            await tx.wait();
            setIsOpen(-1);
        } catch (e) {
            alert("You can't bet on this match");
        }
    }

    useEffect(() => {
        async function fetchData() {
            const data = (await contractProvider.getMatches());
            setMatches(data);
        }

        if (contractProvider)
            fetchData();
    }, [contractProvider]);

    return (
        <div className="w-full flex flex-wrap px-4">
            {matches.map((match, index) => (
                <Match key={index} match={match} index={index} contractSigner={contractSigner} setIsOpen={setIsOpen} connectwalletHandler={connectwalletHandler} />
            ))}
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} match={matches[isOpen]} bet={bet} loading={loading} />
        </div>
    )
}

const Match = ({ match, index, contractSigner, setIsOpen, connectwalletHandler }) => {

    return (
        <div className="group relative w-full max-w-xs overflow-hidden rounded-lg bg-slate-800 p-0.5 transition-all duration-500 hover:scale-[1.01] hover:bg-slate-800/50">
            <div className="relative z-10 flex flex-col items-center overflow-hidden rounded-[7px] bg-slate-900 px-8 py-5 transition-colors duration-500 group-hover:bg-slate-800">
                <svg className="relative z-10 mb-5 mt-2 w-20 h-20 rounded-full border-2 border-indigo-500 bg-slate-900 p-4 text-7xl text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <h4 className="relative z-10 mb-4 w-full text-3xl font-bold text-slate-50">
                    {match[2]} - {match[3]}
                </h4>
                <p className="relative z-10 text-slate-400 w-full">
                    Match start at {new Date((match[1]).toString() * 1000).toLocaleString()}
                </p>
                <button
                    className="px-3 py-2 mt-5 w-48 bg-indigo-800 whitespace-nowrap hover:bg-indigo-700 rounded-md transition-colors relative"
                    onClick={() => contractSigner ? setIsOpen(index) : connectwalletHandler()}
                >
                    {
                        contractSigner ?
                            "Place a bet"
                            :
                            "Connect wallet"
                    }
                </button>
            </div>

            <motion.div
                initial={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                style={{ scale: 1.75 }}
                transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "linear",
                }}
                className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-200 via-indigo-200/0 to-indigo-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
        </div>
    );

};
const Modal = ({ isOpen, setIsOpen, match, bet, loading }) => {
    return (
        <AnimatePresence>
            {isOpen !== -1 && (
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
                        <svg className="text-white/10 rotate-12 w-96 h-96 absolute z-0 -top-24 -left-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        <div className="relative z-10">
                            <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <h3 className="text-3xl font-bold text-center mb-2">
                                {match[2]} - {match[3]}
                            </h3>
                            <div className="flex gap-2 justify-center">
                                <input id="score1" className="rounded-sm text-center mb-4 p-2 text-black focus:outline-none" type="number" placeholder={`score ${match[2]}`} />
                                <input id="score2" className="rounded-sm text-center mb-4 p-2 text-black focus:outline-none" type="number" placeholder={`score ${match[3]}`} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(-1)}
                                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={bet}
                                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                >
                                    {loading ?
                                        "Loading..."
                                        :
                                        "Place my bet !"
                                    }
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Matches;