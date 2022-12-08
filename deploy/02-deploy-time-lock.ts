import { DeployFunction } from 'hardhat-deploy/types'
import { network, getChainId } from 'hardhat'
import { MIN_DELAY, networkConfig } from '../helper-hardhat-config'

const deployTimeLock: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId =  await getChainId()

    log('------------')
    const timeLok = await deploy('TimeLock', {
        from: deployer,
        log: true,
        args: [MIN_DELAY, [], []],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })
}

export default deployTimeLock
deployTimeLock.tags = ['all', 'timeLok']