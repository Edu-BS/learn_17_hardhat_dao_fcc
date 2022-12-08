import { ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig } from "../helper-hardhat-config"
import { GovernanceToken } from "../typechain-types"

const deployGovernanceToken: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
    network,
}) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!

    log("------------")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })

    await delegate(governanceToken.address, deployer)
    log("Delegated!")
}

const delegate = async (governanceTokenAddress: string, deletedAccount: string) => {
    const governanceToken: GovernanceToken = await ethers.getContractAt(
        "GovernanceToken",
        governanceTokenAddress
    )
    const tx = await governanceToken.delegate(deletedAccount)
    await tx.wait(1)
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(deletedAccount)}`);
    
}

export default deployGovernanceToken
deployGovernanceToken.tags = ["all", "governanceToken"]
