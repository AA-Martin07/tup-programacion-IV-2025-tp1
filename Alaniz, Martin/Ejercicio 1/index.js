import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

const calculos = []
let nextId = 1

app.post('/rectangulo', (req, res) => {
  let { opcion, base, altura } = req.body   

  opcion = opcion.toLowerCase()

  if (opcion !== 'area' && opcion !== 'perimetro') {
    return res.status(400).json({ error: 'Opción inválida, debe ser "area" o "perimetro"' })
  }

  if (!base || !altura || base <= 0 || altura <= 0) {
    return res.status(400).json({ error: 'Base y altura deben ser números positivos' })
  }

  let resultado
  if (opcion === 'area') {
    resultado = base * altura
  } else {
    resultado = 2 * (base + altura)
  }

  const newCalculo = { id: nextId++, opcion, base, altura, resultado }
  calculos.push(newCalculo)

  res.json(newCalculo)
})


app.get('/calculos', (req, res) => {
  if (calculos.length === 0) {
    return res.json({ message: 'No hay cálculos realizados aún.' })
  }
  const formaResultados = calculos.map(c =>{
    const tipo = c.base === c.altura ? 'cuadrado' : 'rectángulo'
    return { ...c, tipo }
  })
  res.json({ calculos: formaResultados})
})

app.get('/calculos/:id', (req, res) => {
  const id = parseInt(req.params.id)
  if (isNaN(id) || id < 1 || id > calculos.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const calculo = calculos.find(c => c.id === id)
  if (!calculo) {
    return res.status(404).json({ error: 'Cálculo no encontrado' })
  }
  res.json(calculo)
})

app.delete('/calculos/:id', (req, res) => {
  const id = parseInt(req.params.id)
  if (isNaN(id) || id < 1 || id > calculos.length) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  const index = calculos.find(c => c.id === id)
  const calculoEliminado = calculos.splice(index, 1)
  res.json({ message: 'Cálculo eliminado', calculo: calculoEliminado})
})

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`)
})
