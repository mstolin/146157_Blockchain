import { useMetaMask } from '../../hooks/useMetaMask'
import { formatAddress } from '../../utils'

const Header = () => {
    const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();

    return (
        <header>
            <nav>
                <ul>
                    <li>Home</li>
                    <li>My Campaigns</li>
                    <li>Create Campaign</li>
                </ul>
            </nav>
            <aside>
            {!hasProvider &&
                <a href="https://metamask.io" target="_blank">
                    Install MetaMask
                </a>
            }
            {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
                <button disabled={isConnecting} onClick={connectMetaMask}>
                    Connect MetaMask
                </button>
            }
            {hasProvider && wallet.accounts.length > 0 &&
                <a
                    className="text_link tooltip-bottom"
                    href={`https://etherscan.io/address/${wallet}`}
                    target="_blank"
                    data-tooltip="Open in Block Explorer"
                >
                    {formatAddress(wallet.accounts[0])} - {wallet.balance}
                </a>
            }
            </aside>
        </header>
    );
};

export default Header;
