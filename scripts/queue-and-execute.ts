import { mine, time } from "@nomicfoundation/hardhat-network-helpers"
import { increase } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time"
import { ethers, network } from "hardhat"
import {
    developmentChains,
    FUNC,
    MIN_DELAY,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
} from "../helper-hardhat-config"
import { Box, GovernorContract } from "../typechain-types"
import { getProposals } from "../utils/getProposals"

export async function queueAndExecute() {
    let proposals, value
    const args = [NEW_STORE_VALUE]

    proposals = getProposals("proposals.json")
    value = proposals[network.config.chainId!].length - 1

    const box: Box = await ethers.getContract("Box")
    const governor: GovernorContract = await ethers.getContract("GovernorContract")
    // @ts-ignore
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    
    console.log("Queueing")
    try {
        console.log(`Queue: ${[box.address]}, ${[value]}, ${[encodedFunctionCall]}, ${descriptionHash}`);
        const quequeTx = await governor.queue(
            [box.address],
            [value],
            [encodedFunctionCall],
            descriptionHash
        )
        await quequeTx.wait(1)
    } catch (err: any) {
        console.error(`QUEUE ERROR => ${err.error.message}`)
    }

    if (developmentChains.includes(network.name)) {
        console.log(`Block: ${await time.latest()}`)
        await increase(MIN_DELAY + 1)
        await mine(1)
        console.log(`Block: ${await time.latest()}`)
    }

    console.log("Executing...")

    try {
        const executeTx = await governor.execute(
            [box.address],
            [value],
            [encodedFunctionCall],
            descriptionHash
        )
        await executeTx.wait(1)
    
    } catch (err: any) {
        console.error(`EXECUTE ERROR => ${err.error.message}`)
    }
    
    const boxNewValue = await box.retrieve()
    console.log(`New Box Value: ${boxNewValue.toString()}`)
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
