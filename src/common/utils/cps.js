const req = require.context('../../components', true, /\.vue$/)
const reqPaths = req.keys()
const files = {}
reqPaths.forEach(item => {
  const keys = item.split('/')
  const key = keys[1]
  const cmp = req(item)
  if (!files[key]) files[key] = []
  files[key].push(cmp.default.name)
})

export default Object.keys(files).map(key => ({
  name: key,
  children: files[key]
}))
