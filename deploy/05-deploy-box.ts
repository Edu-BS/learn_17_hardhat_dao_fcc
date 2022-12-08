import { DeployFunction } from "hardhat-deploy/types"
import { network, getChainId, ethers } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"
import { Box, TimeLock } from "../typechain-types"

const deployBox: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    log("------------")
    const box = await deploy("Box", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })

    const timeLock: TimeLock = await ethers.getContract("TimeLock")
    const boxContract: Box = await ethers.getContract("Box")
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait(1)
    log("Deploy DONE!!")
}

export default deployBox
deployBox.tags = ["all", "box "]
