import { ethers, network } from "hardhat"
import { developmentChains, FUNC, NEW_STORE_VALUE, proposalsFile, PROPOSAL_DESCRIPTION, VOTING_DELAY } from "../helper-hardhat-config"
import { Box, GovernorContract } from "../typechain-types"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs" 

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governor: GovernorContract = await ethers.getContract("GovernorContract")
    const box: Box = await ethers.getContract("Box")
    // @ts-ignore
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)

    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal description: \n ${proposalDescription}`)
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    const proposeTxReceipt = await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
        moveBlocks(VOTING_DELAY + 1)
    }

    const proposalId = proposeTxReceipt.events![0].args!.proposalId;
    if (!fs.existsSync(proposalsFile)) {
        let emptyProposal = {"31337": []}
        fs.writeFileSync(proposalsFile, JSON.stringify(emptyProposal), "utf-8")
    }
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"))

    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
