SQLITO
==================

Sqlito [ese ku li toh]  
This is a flat file parser in memory. It was created to be used in tandem with SiteCraft,
which saves all posts in MD files separated into two parts eachfile by 2 newlines:

- First part is a YAML section with meta information about the post
- Second part is the actual post in MD format

Sqlito reads all files where it is indicated and parses the YAML part and loads that into memory,
Then it exposes all entries into memory, that can be queried by tag or text.

## Usage
```javascript
import Sqlito from 'sqlito'

//const sqlito = new Sqlito('path/to/posts', ['values', 'to', 'index'])
const sqlito = new Sqlito('path/to/posts', ['title', 'excerpt', 'tags'])

sqlito.allFromTag('myTag') // wiil return all posts with tag "myTag"
sqlito.allWithText('some text') // will return all posts with "some text" in title, excerpt or tag

```

### Post Example:
```markdown
meta:
  title: CSS
  date: 202406141919
  author: Zero
  excerpt: CSS significa Hojas de Estilo en Cascada
  pronuntiation: [ si-es-es ] o [ se-ese-ese ]
  tags:
    - C
    - S

## CSS
CSS significa Hojas de Estilo en Cascada. Es un lenguaje utilizado para describir la apariencia y formato de un documento escrito en HTML. Con CSS, puedes controlar el diseño, colores, fuentes y otros aspectos visuales de tus páginas web. Proporciona una forma de separar el contenido de una página web de su presentación, lo que facilita el mantenimiento y actualización del diseño de un sitio web. CSS utiliza una estructura de selector y bloque de declaración, donde los selectores apuntan a elementos HTML específicos y los bloques de declaración definen los estilos a aplicar.
```

### Parsed Data:
```javascript
[
  // location will resolve from path/to/psots/<filename>.md whish SiteCraft uses as path
  "location": "css",
  "title": "CSS",
  "excerpt": "CSS significa Hojas de Estilo en Cascada",
  "tags": [
    "C",
    "S"
  ]
]
```

It only parses the first (YAML) section, everything else is ignored

Sqlito perse has no dependencies and exposes only minimal data into memory to be used by a web server

## Example using express

```javascript
import express from 'express'
import Sqlito from 'sqlito'

const app = express()
const sqlito = new Sqlito('content/posts', ['title', 'excerpt', 'tags'])

app.get('/tag/:tag', (req, res) => {
  const { tag } = req.params
  const entries = sqlito.allFromTag(tag)
  res.json(entries)
})

app.get('/search/:term', (req, res) => {
  const { term } = req.params
  const entries = sqlito.allWithText(term)
  res.json(entries)
})

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`)
})
```
