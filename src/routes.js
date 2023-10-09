import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const search = database.select('tasks', { "title": title, "description": description })
            if (search[0]) {
                return res.writeHead(400).end(`o title ou description informado já está presente na task de id ${search.id}`)
            }


            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date(),
                updated_at: new Date(),
                completed_at: null
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body



            if (!database.select('tasks', id)) return res.writeHead(400).end('ID não encontrado')

            const search = database.select('tasks', { "title": title, "description": description })
            if (search[0]) {
                return res.writeHead(400).end(`o title ou description informado já está presente na task de id ${search.id}`)
            }

            database.update('tasks', id, {
                updated_at: new Date(),
                title,
                description,
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            if (!database.select('tasks', id)) return res.writeHead(400).end('ID não encontrado')

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            if (!database.select('tasks', id)) return res.writeHead(400).end('ID não encontrado')
            database.update('tasks', id, {
                updated_at: new Date(),
                completed_at: new Date()
            })

            return res.writeHead(204).end()
        }
    }
]