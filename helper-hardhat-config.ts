export interface networkConfigItem {
    name?: string
    wethToken?: string
    lendingPoolAddressesProvider?: string
    daiEthPriceFeed?: string
    daiToken?: string
    blockConfirmations?: number
    ethUsdPriceFeed?: string
    vrfCoordinatorV2?: string
    subscriptionId?: string
    gasLane?: string
    mintFee?: string
    callbackGasLimit?: string
    linkToken?: string
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        wethToken: "",
        lendingPoolAddressesProvider: "",
        daiEthPriceFeed: "",
        daiToken: "",
        mintFee: "", // 0.01 ETH
        callbackGasLimit: "", // 500,000 gas
        gasLane: "",
        blockConfirmations: 1,
    },
    5: {
        name: "goerli",
        // Link ---
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", // Chainlink price feed contract address
        subscriptionId: "",
        // ---
        blockConfirmations: 3,

    },
    1: {

    }
}

export const developmentChains = ["hardhat", "localhost"]
export const DECIMALS = "18"
export const INITIAL_PRICE = "200000000000000000000"
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
export const frontEndContractsFile = "../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json"
export const frontEndAbiLocation = "../nextjs-nft-marketplace-thegraph-fcc/constants/"

export const MIN_DELAY=3600
export const VOTING_PERIOD = 5;
export const VOTING_DELAY = 1;
export const QUORUM_PERCENTAGE = 4;
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
