import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

const tareas = []
let nextId = 1

app.post('/tareas', (req, res) => {
  let { tarea, estado } = req.body   
  tarea = tarea.toLowerCase().trim()
  estado = estado.toLowerCase().trim()

  if (!tarea || !estado){
    return res.status(400).json({ error: 'No se pudo ingresar la tarea, los campos son obligatorios' })
  }
  if (tarea === '' || typeof tarea !== 'string') {
    return res.status(400).json({ error: 'El campo tarea esta vacio o debe ser una cadena de texto válida' })
  }
  if (estado !== 'completada' && estado !== 'pendiente') {
    return res.status(400).json({ error: 'El campo estado debe ser "completada" o "pendiente"' })
  }
  if (tareas.some(t => t.tarea === tarea)) {
    return res.status(400).json({ error: 'La tarea ya existe' })
  }
  const newTarea = { id: nextId++, tarea, estado }
  tareas.push(newTarea)

  res.json(newTarea)
})

// Obtener todos los alumnos
app.get('/tareas', (req, res) => {
  if (tareas.length === 0) {
    return res.status(404).json({ message: 'Aún no hay tareas.' })
  }
  res.json({ tareas })
})

// Obtener tareas por estado (completada o pendiente)
app.get('/tareas/estado', (req, res) => {
  const estado = req.query.estado.toLowerCase().trim()
  if (!estado || (estado !== 'completada' && estado !== 'pendiente')) {
    return res.status(400).json({ error: 'El campo estado es obligatorio y debe ser "completada" o "pendiente"' })
  }
  const tareasFiltradas = tareas.filter(t => t.estado === estado)
  if (tareasFiltradas.length === 0) {
    return res.status(404).json({ message: `No hay tareas ${estado}.` })
  }
  res.json({ tareas: tareasFiltradas })
})

// Actualizar tarea por id
app.put('/tareas/:id', (req, res) => {
  const id = Number(req.params.id)
  let { tarea, estado } = req.body   
  tarea = tarea.toLowerCase().trim()
  if (isNaN(id) || id < 1 || id > tareas.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const tareaExistente = tareas.find(t => t.id === id)
  if (!tareaExistente) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  if (!tarea || !estado){
    return res.status(400).json({ error: 'No se pudo ingresar la tarea, los campos son obligatorios' })
  }
  if (tarea === '' || typeof tarea !== 'string') {
    return res.status(400).json({ error: 'El campo tarea esta vacio o debe ser una cadena de texto válida' })
  }
  if (estado !== 'completada' && estado !== 'pendiente') {
    return res.status(400).json({ error: 'El campo estado debe ser "completada" o "pendiente"' })
  }
  tareaExistente.tarea = tarea
  tareaExistente.estado = estado
  res.json({ message: 'Tarea actualizada correctamente', tareaExistente })
})

// Obtener una tarea por id
app.get('/tareas/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1 || id > tareas.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const tarea = tareas.find(t => t.id === id)
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  res.json(tarea)
})

// Eliminar una tarea por id
app.delete('/tareas/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1 || id > tareas.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const index = tareas.find(t => t.id === id)
  if (!index) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  const tareaEliminada = tareas.splice(index, 1)
  res.json({ message: 'Tarea eliminada', tareaEliminada })
})

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`)
})