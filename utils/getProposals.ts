import fs from "fs"

export function getProposals(proposalsFile: string) {
    let proposals
    if (!fs.existsSync(proposalsFile)) {
        let emptyProposal = { "31337": [] }
        fs.writeFileSync(proposalsFile, JSON.stringify(emptyProposal), "utf-8")
    }
    proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"))

    return proposals
}