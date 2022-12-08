import pinataSDK from "@pinata/sdk"
import path from "path"
import fs from "fs"
import { config } from "dotenv"

config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

export async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses: any = []
    console.log("Uploading to IPFS!")

    for (const fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        )
        try {
            const res = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(res)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(files)
    return { responses, files }
}

export async function storeTokenUriMetadata(metadata) {
    try {
        const res = await pinata.pinJSONToIPFS(metadata)
        return res
    } catch (error) {
        console.log(error)
    }
    return null
}
