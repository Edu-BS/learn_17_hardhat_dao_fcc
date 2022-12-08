import { DeployFunction } from "hardhat-deploy/types"
import { network, getChainId, ethers } from "hardhat"
import {
    networkConfig,
    QUORUM_PERCENTAGE,
    VOTING_DELAY,
    VOTING_PERIOD,
} from "../helper-hardhat-config"
import { GovernanceToken, TimeLock } from "../typechain-types"

const deployGovernorContract: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    const governanceToken: GovernanceToken = await ethers.getContract("GovernanceToken")
    const timeLock: TimeLock = await ethers.getContract("TimeLock")

    log("------------")
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        log: true,
        args: [
            governanceToken.address,
            timeLock.address,
            VOTING_DELAY,
            VOTING_PERIOD,
            QUORUM_PERCENTAGE,
        ],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })
}

export default deployGovernorContract
deployGovernorContract.tags = ["all", "governorContract"]
