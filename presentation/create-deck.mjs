import pptxgen from 'pptxgenjs'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'presentation', 'Commons-Pitch-Deck.pptx')
const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'Commons Community Resource Exchange'
pptx.subject = 'Hackathon prototype pitch'
pptx.title = 'Commons — Community Resource Exchange'
pptx.company = 'Commons'
pptx.lang = 'en-IN'
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'en-US' }
pptx.defineSlideMaster({
  title: 'LIGHT',
  background: { color: 'F5F7F3' },
  objects: [
    { line: { x: 0.65, y: 7.03, w: 12.03, h: 0, line: { color: 'E2E8DF', width: 1 } } },
    { text: { text: 'COMMONS  ·  COMMUNITY RESOURCE EXCHANGE', options: { x: 0.68, y: 7.12, w: 5.5, h: 0.18, fontFace: 'Aptos', fontSize: 8, color: '839082', charSpacing: 1.1, margin: 0 } } },
  ],
  slideNumber: { x: 12.05, y: 7.10, w: 0.45, h: 0.24, color: '536251', fontFace: 'Aptos', fontSize: 10, bold: true, align: 'right', margin: 0 },
})

const C = {
  forest: '2E6945', darkForest: '234F36', ink: '202821', body: '667268', muted: '8B968A',
  lime: 'DFF18B', pale: 'EDF3E5', white: 'FFFFFF', line: 'E3E9E1',
  peach: 'F6EDE5', peachInk: 'A26D4C', sky: 'EAF2F3', skyInk: '557E8B',
  slate: 'F9FAF7', olive: '6F855A',
}
const SW = 13.333
const SH = 7.5
const FONT = 'Aptos'
const HEAD = 'Aptos Display'

function text(slide, value, x, y, w, h, opts = {}) {
  slide.addText(value, {
    x, y, w, h, fontFace: opts.head ? HEAD : FONT, fontSize: 14, color: C.ink,
    margin: 0, breakLine: false, valign: 'mid', fit: 'shrink',
    ...opts,
  })
}

function shape(slide, type, x, y, w, h, fill, extra = {}) {
  slide.addShape(type, {
    x, y, w, h,
    fill: { color: fill },
    line: { color: extra.line ?? fill, transparency: extra.line ? 0 : 100, width: extra.width ?? 1 },
    radius: extra.radius,
    ...extra,
  })
}

function eyebrow(slide, label, x = 0.72, y = 0.52, color = C.olive) {
  text(slide, label.toUpperCase(), x, y, 8.5, 0.22, { fontSize: 9, bold: true, color, charSpacing: 1.7 })
}

function heading(slide, title, subtitle) {
  text(slide, title, 0.7, 0.95, 11.9, 0.66, { head: true, fontSize: 31, bold: true, charSpacing: -0.5 })
  if (subtitle) text(slide, subtitle, 0.72, 1.67, 11.3, 0.39, { fontSize: 13, color: C.body })
}

function rounded(slide, x, y, w, h, fill, line = null) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.16,
    fill: { color: fill },
    line: { color: line ?? fill, width: line ? 1 : 0, transparency: line ? 0 : 100 },
  })
}

function makeCover() {
  const slide = pptx.addSlide()
  slide.background = { color: 'F5F7F3' }
  shape(slide, pptx.ShapeType.rect, 8.45, 0, 4.89, 7.5, C.darkForest)
  eyebrow(slide, 'Community resource exchange', 0.8, 0.86)
  text(slide, 'Commons', 0.77, 1.52, 6.9, 0.93, { head: true, fontSize: 54, bold: true, charSpacing: -1.8 })
  text(slide, 'Useful things,\nin the right place.', 0.79, 2.58, 7.0, 1.68, { head: true, fontSize: 39, bold: true, breakLine: false, valign: 'top', charSpacing: -1.1, lineSpacingMultiple: 0.91 })
  text(slide, 'A campus-to-community connector for books, food, devices and more.', 0.82, 4.5, 6.6, 0.74, { fontSize: 17, color: C.body, valign: 'top', breakLine: false })
  rounded(slide, 0.82, 5.68, 2.75, 0.5, C.pale)
  text(slide, 'SDG 12  ·  RESPONSIBLE USE', 1.02, 5.81, 2.38, 0.2, { fontSize: 9, bold: true, color: C.forest, charSpacing: 1.1 })
  text(slide, 'Hackathon prototype  ·  17 November 2026', 0.83, 6.85, 5.5, 0.2, { fontSize: 9, color: C.muted })
  text(slide, 'SHARE WHAT IS USEFUL', 8.93, 0.76, 3.8, 0.25, { fontSize: 9, bold: true, color: 'C7D8BE', charSpacing: 1.7, align: 'center' })
  slide.addShape(pptx.ShapeType.ellipse, { x: 9.42, y: 1.54, w: 2.48, h: 2.48, fill: { color: '345F43' }, line: { color: '739168', transparency: 40, width: 1.2 } })
  slide.addShape(pptx.ShapeType.ellipse, { x: 9.8, y: 1.93, w: 1.72, h: 1.72, fill: { color: '234F36' }, line: { color: 'A2B890', width: 1 } })
  text(slide, '↔', 10.06, 2.34, 1.2, 0.68, { fontSize: 39, bold: true, color: C.lime, align: 'center' })
  text(slide, 'CAMPUS', 9.02, 4.43, 1.3, 0.25, { fontSize: 9, bold: true, color: 'C8D8C2', charSpacing: 1.3 })
  text(slide, 'Community', 9.02, 4.77, 2.65, 0.4, { head: true, fontSize: 20, bold: true, color: C.white })
  text(slide, 'A clearer path from surplus\nto local need.', 9.04, 5.3, 3.5, 0.6, { fontSize: 13, color: 'C8D8C2', valign: 'top' })
  return slide
}

function makeGap() {
  const slide = pptx.addSlide('LIGHT')
  eyebrow(slide, '01  /  the gap')
  heading(slide, 'The problem is the missing connection.', 'Useful campus resources and local community needs are often shared in separate places.')

  rounded(slide, 0.75, 2.55, 4.85, 3.27, C.white, C.line)
  rounded(slide, 7.72, 2.55, 4.85, 3.27, C.white, C.line)
  rounded(slide, 1.05, 2.88, 0.45, 0.45, C.pale)
  text(slide, 'CAMPUS SURPLUS', 1.68, 2.94, 3.5, 0.2, { fontSize: 9, bold: true, color: C.olive, charSpacing: 1.3 })
  text(slide, 'Good things,\nwithout a next step.', 1.05, 3.57, 4.1, 0.91, { head: true, fontSize: 24, bold: true, valign: 'top' })
  text(slide, '24 textbooks · 6 laptops · 15 stationery kits', 1.06, 4.72, 4.05, 0.26, { fontSize: 11, color: C.body })
  text(slide, 'Often shared through inboxes, noticeboards and personal contacts.', 1.06, 5.19, 4.15, 0.4, { fontSize: 10, color: C.muted, valign: 'top' })

  rounded(slide, 8.02, 2.88, 0.45, 0.45, C.peach)
  text(slide, 'COMMUNITY NEEDS', 8.65, 2.94, 3.45, 0.2, { fontSize: 9, bold: true, color: C.peachInk, charSpacing: 1.3 })
  text(slide, 'Nearby groups,\nstill searching.', 8.02, 3.57, 4.1, 0.91, { head: true, fontSize: 24, bold: true, valign: 'top' })
  text(slide, '18 school textbooks · 8 learning laptops · meal packs', 8.03, 4.72, 4.15, 0.26, { fontSize: 11, color: C.body })
  text(slide, 'Needs can be hard for campus donors to discover and coordinate.', 8.03, 5.19, 4.1, 0.4, { fontSize: 10, color: C.muted, valign: 'top' })

  shape(slide, pptx.ShapeType.line, 5.7, 4.15, 1.9, 0, C.line, { line: { color: '9DAA98', width: 1.5, dash: 'dash' } })
  slide.addShape(pptx.ShapeType.ellipse, { x: 6.24, y: 3.78, w: 0.72, h: 0.72, fill: { color: C.forest }, line: { color: C.forest } })
  text(slide, '?', 6.24, 3.86, 0.72, 0.42, { fontSize: 23, bold: true, color: C.white, align: 'center' })
  rounded(slide, 4.77, 6.23, 3.85, 0.47, 'EAF0E6')
  text(slide, 'Resources exist. Coordination is fragmented.', 5.02, 6.35, 3.42, 0.2, { fontSize: 10, bold: true, color: C.forest, align: 'center' })
  return slide
}

function makeSolution() {
  const slide = pptx.addSlide('LIGHT')
  eyebrow(slide, '02  /  the idea')
  heading(slide, 'One shared board. A human-led handoff.', 'Commons brings listings and requests together, then explains why a connection may fit.')

  const xs = [0.9, 4.1, 7.35, 10.55]
  const titles = ['LIST', 'MATCH', 'OFFER', 'COMPLETE']
  const descriptions = ['A campus member\nshares usable surplus.', 'Rules surface a\nclear, nearby fit.', 'A donor confirms\nthe offer.', 'A coordinator\ntracks the handoff.']
  const iconLabels = ['01', '02', '03', '04']
  xs.forEach((x, index) => {
    slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.23, y: 3.02, w: 0.98, h: 0.98, fill: { color: index === 1 ? C.darkForest : C.pale }, line: { color: index === 1 ? C.darkForest : 'DCE7D4', width: 1 } })
    text(slide, iconLabels[index], x + 0.23, 3.31, 0.98, 0.31, { head: true, fontSize: 19, bold: true, color: index === 1 ? C.lime : C.forest, align: 'center' })
    text(slide, titles[index], x, 4.25, 1.45, 0.28, { fontSize: 10, bold: true, color: C.olive, charSpacing: 1.2, align: 'center' })
    text(slide, descriptions[index], x - 0.15, 4.68, 1.75, 0.64, { fontSize: 12, color: C.body, align: 'center', valign: 'top' })
    if (index < 3) {
      shape(slide, pptx.ShapeType.line, x + 1.35, 3.51, xs[index + 1] - x - 1.1, 0, 'C9D5C0', { line: { color: 'AFC19F', width: 1.4, dash: 'dash', endArrowType: 'triangle' } })
    }
  })

  rounded(slide, 1.02, 5.96, 11.3, 0.63, C.white, C.line)
  text(slide, 'MATCH FACTORS', 1.29, 6.17, 1.55, 0.18, { fontSize: 8, bold: true, color: C.olive, charSpacing: 1.2 })
  const factors = ['category', 'quantity', 'condition', 'distance']
  factors.forEach((factor, index) => {
    const x = 3.05 + index * 2.13
    slide.addShape(pptx.ShapeType.ellipse, { x, y: 6.19, w: 0.08, h: 0.08, fill: { color: C.olive }, line: { color: C.olive } })
    text(slide, factor, x + 0.16, 6.14, 1.7, 0.2, { fontSize: 10, color: C.body })
  })
  return slide
}

function makeDemo() {
  const slide = pptx.addSlide('LIGHT')
  eyebrow(slide, '03  /  live prototype')
  heading(slide, 'One match. One simple next step.', 'A sample campus book listing connects to a nearby learning centre request.')

  rounded(slide, 0.77, 2.5, 5.14, 3.47, C.white, C.line)
  rounded(slide, 1.09, 2.83, 0.5, 0.5, C.pale)
  text(slide, 'CAMPUS LISTING', 1.79, 2.97, 3.6, 0.18, { fontSize: 9, bold: true, color: C.olive, charSpacing: 1.2 })
  text(slide, 'First-year biology\ntextbooks', 1.1, 3.72, 4.1, 0.83, { head: true, fontSize: 24, bold: true, valign: 'top' })
  text(slide, '24', 1.08, 4.91, 1.1, 0.59, { head: true, fontSize: 38, bold: true, color: C.forest })
  text(slide, 'available  ·  good condition', 2.18, 5.12, 2.97, 0.2, { fontSize: 10, color: C.body })
  text(slide, 'Science block · Room 204', 1.1, 5.57, 3.6, 0.2, { fontSize: 9, color: C.muted })

  rounded(slide, 7.42, 2.5, 5.14, 3.47, C.white, C.line)
  rounded(slide, 7.74, 2.83, 0.5, 0.5, C.peach)
  text(slide, 'COMMUNITY REQUEST', 8.44, 2.97, 3.7, 0.18, { fontSize: 9, bold: true, color: C.peachInk, charSpacing: 1.2 })
  text(slide, 'Textbooks for\nsecondary students', 7.75, 3.72, 4.3, 0.83, { head: true, fontSize: 24, bold: true, valign: 'top' })
  text(slide, '18', 7.73, 4.91, 1.1, 0.59, { head: true, fontSize: 38, bold: true, color: C.peachInk })
  text(slide, 'needed  ·  grades 9–12', 8.83, 5.12, 3.0, 0.2, { fontSize: 10, color: C.body })
  text(slide, 'BrightPath Learning Centre · 2.4 km', 7.75, 5.57, 3.8, 0.2, { fontSize: 9, color: C.muted })

  slide.addShape(pptx.ShapeType.ellipse, { x: 6.11, y: 3.79, w: 1.1, h: 1.1, fill: { color: C.forest }, line: { color: C.forest } })
  text(slide, '95%', 6.11, 4.12, 1.1, 0.3, { fontSize: 15, bold: true, color: C.lime, align: 'center' })
  text(slide, 'FIT', 6.11, 4.47, 1.1, 0.16, { fontSize: 7, bold: true, color: C.white, align: 'center', charSpacing: 1.2 })
  rounded(slide, 2.08, 6.23, 9.17, 0.46, C.pale)
  text(slide, 'CATEGORY MATCH  ·  COVERS ALL 18 REQUESTED  ·  2.4 KM AWAY', 2.37, 6.36, 8.6, 0.17, { fontSize: 9, bold: true, color: C.forest, align: 'center', charSpacing: 0.5 })
  text(slide, 'Fictional demo organisations and distance. Fit score comes from prototype rules.', 0.76, 6.81, 9.6, 0.14, { fontSize: 8, color: C.muted })
  return slide
}

function makeTrust() {
  const slide = pptx.addSlide('LIGHT')
  eyebrow(slide, '04  /  responsible by design')
  heading(slide, 'Transparent suggestions. People stay in control.', 'A trustworthy exchange should help coordinate decisions, not make them for the people involved.')

  const signals = [
    ['Category fit', 'Books connect to a book request.'],
    ['Available quantity', 'Show full or partial coverage clearly.'],
    ['Condition', 'Only suggest items marked usable.'],
    ['Known proximity', 'Use distance when provided; otherwise ask.'],
  ]
  signals.forEach(([title, body], index) => {
    const y = 2.48 + index * 0.82
    rounded(slide, 0.78, y, 5.75, 0.65, C.white, C.line)
    slide.addShape(pptx.ShapeType.ellipse, { x: 1.02, y: y + 0.2, w: 0.22, h: 0.22, fill: { color: C.pale }, line: { color: C.pale } })
    text(slide, `${index + 1}`, 1.02, y + 0.215, 0.22, 0.13, { fontSize: 7, bold: true, color: C.forest, align: 'center' })
    text(slide, title, 1.48, y + 0.12, 1.8, 0.19, { fontSize: 11, bold: true, color: C.ink })
    text(slide, body, 3.05, y + 0.12, 3.13, 0.24, { fontSize: 9, color: C.body })
  })

  rounded(slide, 7.03, 2.48, 5.48, 3.93, C.darkForest)
  eyebrow(slide, 'STATUS WITH A HUMAN IN THE LOOP', 7.34, 2.84, 'C8D8BE')
  const statuses = [
    ['AVAILABLE', 'Campus item listed'],
    ['REQUESTED', 'Donor offers the item'],
    ['FULFILLED', 'Coordinator confirms handoff'],
  ]
  statuses.forEach(([status, note], index) => {
    const y = 3.47 + index * 0.82
    slide.addShape(pptx.ShapeType.ellipse, { x: 7.36, y, w: 0.31, h: 0.31, fill: { color: index === 2 ? C.lime : '456F4D' }, line: { color: index === 2 ? C.lime : '8EAB7A', width: 1 } })
    if (index < 2) shape(slide, pptx.ShapeType.line, 7.515, y + 0.31, 0, 0.51, '7D9970', { line: { color: '8DA67E', width: 1.3 } })
    text(slide, status, 7.91, y + 0.02, 1.18, 0.17, { fontSize: 8, bold: true, color: index === 2 ? C.lime : 'DAE6D2', charSpacing: 1.2 })
    text(slide, note, 9.13, y + 0.02, 2.75, 0.18, { fontSize: 9, color: 'D1DDCF' })
  })
  text(slide, 'NGO verification is simulated; no government identity check is connected.', 7.37, 6.11, 4.7, 0.18, { fontSize: 8, color: 'C8D8BE' })
  text(slide, 'No model dependency. No automated approvals.', 0.81, 6.16, 5.75, 0.22, { fontSize: 10, bold: true, color: C.forest })
  text(slide, 'Demo records stay in local browser storage. The production build starts with no sample records.', 0.81, 6.45, 5.9, 0.22, { fontSize: 9, color: C.muted })
  return slide
}

function makePilot() {
  const slide = pptx.addSlide()
  slide.background = { color: C.darkForest }
  eyebrow(slide, '05  /  the next step', 0.79, 0.68, 'C8D8BE')
  text(slide, 'Start with one\ncampus cluster.', 0.76, 1.24, 6.2, 1.48, { head: true, fontSize: 43, bold: true, color: C.white, valign: 'top', charSpacing: -1.2 })
  text(slide, 'A small, coordinated pilot can show what is useful before adding integrations or complexity.', 0.8, 3.02, 5.85, 0.68, { fontSize: 15, color: 'D2DED0', valign: 'top' })
  rounded(slide, 0.8, 4.35, 5.58, 0.66, '315B3E')
  text(slide, 'PROPOSED START  ·  1 CAMPUS  +  3 LOCAL PARTNERS', 1.06, 4.57, 5.1, 0.17, { fontSize: 9, bold: true, color: C.lime, charSpacing: 0.8, align: 'center' })
  text(slide, 'Measure what the pilot actually proves:', 0.82, 5.42, 4.8, 0.24, { fontSize: 10, bold: true, color: 'D3DFD0' })
  text(slide, 'listed items  ·  suggested fits  ·  accepted offers  ·  completed handoffs', 0.82, 5.81, 6.18, 0.35, { fontSize: 10, color: 'BBCDB8' })

  rounded(slide, 7.36, 1.04, 5.16, 5.3, '2B5B3E', '57765A')
  text(slide, 'LEARN BEFORE YOU SCALE', 7.73, 1.43, 4.3, 0.22, { fontSize: 9, bold: true, color: C.lime, charSpacing: 1.4 })
  const roadmap = [
    ['01', 'Onboard', 'Campus coordinators and community partners'],
    ['02', 'Coordinate', 'Confirm availability, pickup and handoff'],
    ['03', 'Review', 'Track matches, completion and gaps'],
    ['04', 'Expand', 'Add shared data and verification integrations'],
  ]
  roadmap.forEach(([n, title, body], index) => {
    const y = 2.03 + index * 0.88
    text(slide, n, 7.75, y, 0.47, 0.25, { fontSize: 10, bold: true, color: 'B4CA9A' })
    text(slide, title, 8.3, y - 0.01, 1.25, 0.24, { fontSize: 12, bold: true, color: C.white })
    text(slide, body, 9.48, y + 0.01, 2.55, 0.28, { fontSize: 9, color: 'C8D8C2' })
    if (index < 3) shape(slide, pptx.ShapeType.line, 8.0, y + 0.33, 0, 0.45, '638162', { line: { color: '638162', width: 1 } })
  })
  text(slide, 'Keep useful things in use.', 7.75, 5.89, 4.2, 0.29, { head: true, fontSize: 18, bold: true, color: C.lime })
  text(slide, 'Commons · Prototype concept · 17 November 2026', 0.8, 7.07, 6.8, 0.19, { fontSize: 8, color: 'B6C9B2' })
  return slide
}

await mkdir(dirname(OUTPUT), { recursive: true })
makeCover()
makeGap()
makeSolution()
makeDemo()
makeTrust()
makePilot()
await pptx.writeFile({ fileName: OUTPUT })
console.log(`Created ${OUTPUT}`)
