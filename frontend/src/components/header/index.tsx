import Account from "./Account";

const Header = () => {
    return (
        <header className='bg-white'>
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Home</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Create Campaign</a>
                </div>
            </nav>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <Account />
            </div>
        </header>
    );
};

export default Header;
