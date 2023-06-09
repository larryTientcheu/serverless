import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('attachmentUtils')

// TODO: Implement the fileStogare logic

export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly signedUrlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)
    ){}

    async generateUploadUrl(attachmentId:string): Promise<string>{
        logger.info(`Generating the signed url for attachment ${attachmentId}`)
        const params = {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: this.signedUrlExpiration
        }
        return this.s3.getSignedUrl('putObject', params)
    }

    async getAttachmentUrl(attachmentId:string): Promise<string>{
        const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
        return attachmentUrl
    }
}