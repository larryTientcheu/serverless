import { TodosAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()

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
