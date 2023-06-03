import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

    constructor(
        
        // private readonly s3 = process.env.ATTACHMENT_S3,
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()

    ){}

    async getTodosForUser(userId: string): Promise<TodoItem[]>{
        logger.info('Getting Todo\'s')

        let params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {':userId': userId}
        }
        const items = (await this.docClient.query(params).promise()).Items;
        logger.info(`User ${userId} has ${items.length} items`)
        return items as TodoItem[]
    }

}