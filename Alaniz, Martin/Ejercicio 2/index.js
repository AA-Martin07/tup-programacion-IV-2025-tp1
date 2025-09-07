import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

const alumnos = []
let nextId = 1

app.post('/alumnos', (req, res) => {
  let { nombre, notas } = req.body   
  nombre = nombre.toLowerCase().trim()

  if (!nombre || !notas || notas.length < 3){
    return res.status(400).json({ error: 'No se pudo ingresar el alumno, nombre y notas son obligatorios' })
  }
  if (nombre === '' || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'El nombre esta vacio o debe ser una cadena de texto válida' })
  }

   if (notas.some(nota => isNaN(nota) || nota < 0 || nota > 10)) {
    return res.status(400).json({ error: 'Las notas deben ser números entre 0 y 10' })
  }

  const newAlumno = { id: nextId++, nombre, notas }
  alumnos.push(newAlumno)

  res.json(newAlumno)
})
// Obtener todos los alumnos
app.get('/alumnos', (req, res) => {
  if (alumnos.length === 0) {
    return res.status(404).json({ message: 'No hay alumnos cargados aún.' })
  }
  res.json({ alumnos })

})
// Obtener alumnos por nombre
app.get('/alumnos/nombre', (req, res) => {
  const nombre = req.query.nombre.trim()

  if(alumnos.length === 0)
    return res.status(404).json({ error: 'No hay alumnos cargados aún.' })
  
  if(!nombre)
    return res.status(404).json({ error: 'Debe ingresar un nombre' })
  
  const alumnosFiltrados = alumnos.filter((a) => a.nombre.toLowerCase().includes(nombre.toLowerCase()))

  if (alumnosFiltrados.length === 0) {
    return res.status(404).json({ success: false, message: `no se encontraron coincidencias en ${nombre}` })
  }
  res.json({ alumnos: alumnosFiltrados })
})
// Obtener alumno por ID
app.get('/alumnos/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1 || id > alumnos.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const alumno = alumnos.find(a => a.id === id)
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' })
  }
  res.json(alumno)
})
// Obtener promedio del alumno por ID
app.get('/alumnos/:id/notas', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1 || id > alumnos.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const alumno = alumnos.find(a => a.id === id)
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' })
  }
  const promedio = alumno.notas.reduce((acc, curr) => acc + curr, 0) / alumno.notas.length
  res.json({ alumno: alumno.nombre, notas: alumno.notas, promedio: promedio.toFixed(2), estado: promedio < 6 ? 'desaprobado' : promedio >= 6 && promedio < 8 ? 'aprobado' : 'promocionado' })
})
// Eliminar alumno por ID
app.delete('/alumnos/:id', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id) || id < 1 || id > alumnos.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const index = alumnos.find(a => a.id === id)
  const alumnoEliminado = alumnos.splice(index, 1)
  res.json({ message: 'Alumno eliminado', calculo: alumnoEliminado})
})
// Actualizar alumno por ID
app.put('/alumnos/:id', (req, res) => {
  const id = Number(req.params.id)
  let { nombre, notas } = req.body
  
  if (isNaN(id) || id < 1 || id > alumnos.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const alumno = alumnos.find(a => a.id === id)
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' })
  }

  if (notas.some(nota => isNaN(nota) || nota < 0 || nota > 10)) {
    return res.status(400).json({ error: 'Las notas deben ser números entre 0 y 10' })
  }
  alumno.nombre = nombre.toLowerCase().trim()
  alumno.notas = notas
  res.json({ mesage: 'Alumno actualizado correctamente',alumno})
})

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`)
})