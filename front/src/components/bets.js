const Bets = ({ account, connectwalletHandler }) => {
    return (
        !account ?
            <div className="w-full h-[calc(100vh-66px)] flex items-center justify-center">
                <button
                    className="px-3 py-2 w-48 bg-indigo-800 whitespace-nowrap hover:bg-indigo-700 rounded-md transition-colors relative"
                    onClick={connectwalletHandler}>
                    Connect wallet
                </button>
            </div>
            :
            <div>
                
            </div>
    );
}

export default Bets;