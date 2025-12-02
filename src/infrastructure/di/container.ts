import { ApiTodoRepository } from '../../data/repositories/ApiTodoRepository';
import { GetTodos } from '../../domain/usecases/GetTodos';
import { AddTodo } from '../../domain/usecases/AddTodo';
import { UpdateTodo } from '../../domain/usecases/UpdateTodo';
import { DeleteTodo } from '../../domain/usecases/DeleteTodo';

import { config } from '../config/environment';

const repository = new ApiTodoRepository(config.apiUrl);


export const useCases = {
    getTodos: new GetTodos(repository),
    addTodo: new AddTodo(repository),
    updateTodo: new UpdateTodo(repository),
    deleteTodo: new DeleteTodo(repository),
};
