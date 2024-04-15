const exts = {
  DOC: 'doc',
  PDF: 'pdf',
  DOCX: 'docx',
  TXT: 'txt'
}

const mime = {
  [exts.DOC]: 'application/msword',
  [exts.PDF]: 'application/pdf',
  [exts.DOCX]: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [exts.TXT]: 'text/plain'
}

module.exports = {
  exts,
  mime
}
