import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';


const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

    constructor(
        
        // private readonly s3 = process.env.ATTACHMENT_S3,
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()

    ){}

    async getTodosForUser(userId:string): Promise<TodoItem[]>{
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

    async createTodo(todo: TodoItem): Promise<TodoItem>{
        logger.info(`Creating todo item: ${todo.todoId}`)

        let params = {
            TableName: this.todosTable,
            Item: todo
        }
        await this.docClient.put(params).promise();
        return todo as TodoItem
    }

    async updateTodo(userId:string, todoId:string, todoUpdate: TodoUpdate){
        logger.info(`Updating todo item ${todoId}`)

        // Only the current user can update his todo items
        let params = {
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'duedate',
                '#done': 'done'
            },
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
        }
        await this.docClient.update(params).promise();
        logger.info(`Todo item ${todoId} has been updated`)
    }

    async deleteTodo(userId:string, todoId:string){
        logger.info(`Deleting todo item ${todoId}`)

        // Only the current user can delete his todo items
        let params = {
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            }
        }
        await this.docClient.delete(params).promise();
        logger.info(`Todo item ${todoId} has been deleted`)

    }

    async updateAttachmentUrl(uploadUrl:string, userId:string, todoId:string){
        logger.info(`Updating the attachment url for todo item ${todoId}`)

        let params = {
            TableName: this.todosTable,
            Key: {
                'userId': userId,
                'todoId': todoId
            },
            UpdateExpression: 'set #uploadUrl = :uploadUrl',
            ExpressionAttributeNames: {
                '#uploadUrl': 'uploadUrl'
            },
            ExpressionAttributeValues:{
                ':uploadUrl': uploadUrl
            }
        }

        await this.docClient.update(params).promise();
        logger.info(`Upload Url for Todo item ${todoId} has been updated`)
    }
}
