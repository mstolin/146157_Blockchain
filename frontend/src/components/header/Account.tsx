import { useMetaMask } from '../../hooks/useMetaMask'
import { formatAddress } from '../../utils'

const Account = () => {
    const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();

    return (
        <div>
            {!hasProvider &&
                <a href="https://metamask.io" className="text-sm font-semibold leading-6 text-gray-900">Install MetaMask</a>
            }
            {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
                <button disabled={isConnecting} onClick={connectMetaMask}>
                    Connect MetaMask
                </button>
            }
            {hasProvider && wallet.accounts.length > 0 &&
                <span className="text-sm font-semibold leading-6 text-gray-900">Logged in as {formatAddress(wallet.accounts[0])}</span>
            }
        </div>
    );
};

export default Account;
