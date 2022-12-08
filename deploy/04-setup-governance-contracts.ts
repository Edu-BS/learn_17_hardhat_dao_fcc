import { DeployFunction } from 'hardhat-deploy/types'
import { network, getChainId, ethers } from 'hardhat'
import { ADDRESS_ZERO, networkConfig } from '../helper-hardhat-config'
import { GovernorContract, TimeLock } from '../typechain-types'

const deployGovernanceContract: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId =  await getChainId()

    const timeLock: TimeLock = await ethers.getContract("TimeLock", deployer)
    const governor: GovernorContract = await ethers.getContract("GovernorContract")

    log("Setting up roles...")
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait(1)

    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
}

export default deployGovernanceContract
deployGovernanceContract.tags = ['all', 'governanceContract']