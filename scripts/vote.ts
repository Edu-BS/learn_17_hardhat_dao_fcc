import {
    developmentChains,
    FUNC,
    NEW_STORE_VALUE,
    proposalsFile,
    PROPOSAL_DESCRIPTION,
    VOTING_PERIOD,
} from "../helper-hardhat-config"
import fs from "fs"
import { ethers, network, run } from "hardhat"
import { GovernorContract } from "../typechain-types"
import { moveBlocks } from "../utils/move-blocks"
import { mine, time } from "@nomicfoundation/hardhat-network-helpers"
import { propose } from "./propose"

const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"))
const index = proposals[network.config.chainId!].length - 1

async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    // 0 = Agains, 1 = For, 2 = Abstain
    const voteWay = 1
    const governor: GovernorContract = await ethers.getContract("GovernorContract")
    const reason = "I like it"
    await governor
        .castVoteWithReason(proposalId, voteWay, reason)
        .then(async (resTx) => {
            await resTx.wait(1)
        })
        .catch((err) => {
            console.error(`${err.error.message}`)
        })

    if (developmentChains.includes(network.name)) {
        console.log(await time.latest())
        await mine(5)
        console.log(await time.latest())
        console.log("Closed voting period")
    }

    console.log(await governor.state(proposalId))
    console.log("Voted!")
}

main(index)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
