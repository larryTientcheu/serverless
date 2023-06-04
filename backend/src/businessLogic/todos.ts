import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId:string): Promise<TodoItem[]> {
    return await todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId:string, todo: CreateTodoRequest): Promise<TodoItem>{
    
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const done = false

    return await todosAccess.createTodo({
        userId, todoId, createdAt, done, ...todo
    })    
}

export async function updateTodo(userId:string, todoId:string, todoUpdate: UpdateTodoRequest) {
    await todosAccess.updateTodo(userId, todoId, todoUpdate)
}

export async function deleteTodo(userId:string, todoId:string) {
    await todosAccess.deleteTodo(userId, todoId)
}

export async function generateUploadUrl(attachmentId:string): Promise<string>{
    return await attachmentUtils.generateUploadUrl(attachmentId)
}

export async function updateAttachmentUrl(attachmentId:string, userId:string, todoId:string){
    const attachmentUrl = await attachmentUtils.getAttachmentUrl(attachmentId)
    await todosAccess.updateAttachmentUrl(attachmentUrl, userId, todoId)
    
}
