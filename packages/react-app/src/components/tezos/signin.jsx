import {
    connectWallet,
    getActiveAccount,
    disconnectWallet,
  } from "../../utils/wallet";

export default function Signin(props) {

    const handleConnectWallet = async () => {
        const {wallet} = await connectWallet();
        props.setWallet(wallet);
    };

    const handleDisconnectWallet = async () => {
        const {wallet} = await disconnectWallet();
        props.setWallet(wallet);
    };

    return (
        <>
        {props.address
            ?
            <>
                {props.address}
                <button
                    onClick={handleDisconnectWallet}
                    
                >
                    Sign out
                </button>
            </>
            :
            <button
                onClick={handleConnectWallet}
            >
                {"sync"}
            </button>
        }
        </>
    )
}
