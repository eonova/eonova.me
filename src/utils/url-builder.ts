export function isPostModel(model: any) {
  return isDefined(model.title) && isDefined(model.slug) && !isDefined(model.order)
}

export function isPageModel(model: any) {
  return isDefined(model.title) && isDefined(model.slug) && isDefined(model.order)
}

export function isNoteModel(model: any) {
  return isDefined(model.title) && isDefined(model.nid)
}

function isDefined(data: any) {
  return data !== undefined && data !== null
}
