export const fileUpload = function (success) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute(
    'accept',
    'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
  )
  input.addEventListener('change', function (e) {
    const files = e.target.files
    const file = files[0]
    const r = new FileReader()
    r.onload = function () {
      success({
        baseData: r.result,
        type: file.type,
        size: file.size,
        fileName: file.name
      })
    }
    r.readAsDataURL(file)
  })
  input.click()
}
