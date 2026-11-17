import { useEffect, useMemo, useState } from 'react'
import {
  IconArrowDownRight,
  IconArrowRight,
  IconArrowsExchange,
  IconBell,
  IconBook2,
  IconBuildingCommunity,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconClock,
  IconCoffee,
  IconDeviceLaptop,
  IconFilter,
  IconHeartHandshake,
  IconLeaf,
  IconMapPin,
  IconMenu2,
  IconPackage,
  IconPlus,
  IconSearch,
  IconSettings,
  IconSparkles,
  IconUsers,
  IconX,
} from '@tabler/icons-react'
import { seedListings, seedRequests } from '@demo-data'

const DEMO_MODE = import.meta.env.MODE === 'demo'

const navItems = [
  { key: 'overview', label: 'Overview', icon: IconBuildingCommunity },
  { key: 'matches', label: 'Match board', icon: IconArrowsExchange, count: 3 },
  { key: 'listings', label: 'Surplus listings', icon: IconPackage },
  { key: 'requests', label: 'Community needs', icon: IconHeartHandshake },
]

const pitchSlides = [
  { eyebrow: 'THE GAP', title: 'Good resources are going unused.', body: 'At the same time, nearby community groups are searching for the very things campuses already have.', stat: 'One campus. Two separate conversations.', color: 'green', cue: 'Open with the everyday mismatch: a storeroom full of usable books, while a nearby learning centre is asking for them.' },
  { eyebrow: 'THE IDEA', title: 'Make the right connection visible.', body: 'Commons turns campus surplus and local requests into one shared, searchable exchange.', stat: 'List → match → hand off', color: 'peach', cue: 'Introduce Commons as a coordination layer. No complicated logistics or charity marketplace; just make a useful connection easier.' },
  { eyebrow: 'THE FLOW', title: 'A match you can explain.', body: 'Category, quantity, condition and distance shape each suggestion. A person reviews the fit, then offers the item.', stat: DEMO_MODE ? '24 books · 18 needed · 2.4 km' : 'Category + quantity + condition + distance', color: 'blue', cue: DEMO_MODE ? 'Run the live prototype: show the textbook match, explain why it fits, offer the books, and point out the status update.' : 'Demonstrate how matching rules explain their suggestions and keep people in control.' },
  { eyebrow: 'THE OUTCOME', title: 'Less waste. More local value.', body: 'Every completed handoff keeps useful resources in circulation and helps campus communities act on local needs.', stat: 'Start with one campus cluster.', color: 'sage', cue: 'Close with a practical pilot: one campus, a few partner organisations, a coordinator, and simple handoff tracking.' },
]

const categoryIcon = { Books: IconBook2, Devices: IconDeviceLaptop, Food: IconCoffee, Stationery: IconPackage, Furniture: IconPackage }

function readStored(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function getInitialData() {
  if (!DEMO_MODE) return { listings: [], requests: [] }
  return {
    listings: readStored('commons-demo-listings', seedListings),
    requests: readStored('commons-demo-requests', seedRequests),
  }
}

function matchScore(listing, request) {
  if (listing.status !== 'Available' || request.status === 'Fulfilled') return 0
  if (listing.category.toLowerCase() !== request.category.toLowerCase()) return 0
  let score = 55
  if (listing.quantity >= request.quantity) score += 20
  else if (listing.quantity >= Math.ceil(request.quantity * 0.5)) score += 12
  if (['Good', 'New', 'Refurbished', 'Fresh today'].includes(listing.condition)) score += 12
  if (Number.isFinite(request.distanceKm) && request.distanceKm <= 5) score += 8
  return score
}

function matchReason(listing, request) {
  const points = []
  if (listing.category === request.category) points.push(`${listing.category.toLowerCase()} match`)
  if (listing.quantity >= request.quantity) points.push(`covers all ${request.quantity} requested`)
  else points.push(`${listing.quantity} available now`)
  points.push(Number.isFinite(request.distanceKm) ? `${request.distanceKm} km away` : 'pickup proximity to confirm')
  return points.join(' · ')
}

function formatQuantity(value) {
  return Number(value).toLocaleString('en-IN')
}

function App() {
  const initial = useMemo(getInitialData, [])
  const [listings, setListings] = useState(initial.listings)
  const [requests, setRequests] = useState(initial.requests)
  const [page, setPage] = useState('overview')
  const [role, setRole] = useState('Campus partner')
  const [roleMenu, setRoleMenu] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [pitchIndex, setPitchIndex] = useState(-1)
  const [mobileNav, setMobileNav] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Books', quantity: '', condition: 'Good', location: '', note: '', organization: '', urgency: 'Medium' })
  const [verificationId, setVerificationId] = useState('')
  const [verificationRequested, setVerificationRequested] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    function captureInstall(event) {
      event.preventDefault()
      setInstallPrompt(event)
    }
    window.addEventListener('beforeinstallprompt', captureInstall)
    if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => {})
    return () => window.removeEventListener('beforeinstallprompt', captureInstall)
  }, [])

  useEffect(() => {
    setFilter('All')
    setSearch('')
  }, [page])

  async function installApp() {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const isDemo = DEMO_MODE
  const activeMatches = useMemo(() => listings.flatMap((listing) => requests.map((request) => ({ listing, request, score: matchScore(listing, request) })).filter((match) => match.score > 0)).sort((a, b) => b.score - a.score), [listings, requests])
  const offeredCount = listings.filter((item) => item.status === 'Requested' || item.status === 'Fulfilled').length
  const fulfilledCount = listings.filter((item) => item.status === 'Fulfilled').length
  const availableCount = listings.filter((item) => item.status === 'Available').length
  const matchedPair = activeMatches[0]

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  function saveLists(nextListings, nextRequests) {
    setListings(nextListings)
    setRequests(nextRequests)
    if (isDemo) {
      localStorage.setItem('commons-demo-listings', JSON.stringify(nextListings))
      localStorage.setItem('commons-demo-requests', JSON.stringify(nextRequests))
    }
  }

  function resetDemo() {
    saveLists(seedListings, seedRequests)
    setPage('overview')
    setSearch('')
    setFilter('All')
    notify('Demo reset to the sample campus data')
  }

  function offerMatch(listingId, requestId) {
    const nextListings = listings.map((item) => item.id === listingId ? { ...item, status: 'Requested' } : item)
    const nextRequests = requests.map((item) => item.id === requestId ? { ...item, status: 'Matched' } : item)
    saveLists(nextListings, nextRequests)
    setModal(null)
    notify('Offer sent — the match is now being coordinated')
  }

  function fulfillListing(listingId) {
    const listing = listings.find((item) => item.id === listingId)
    const nextListings = listings.map((item) => item.id === listingId ? { ...item, status: 'Fulfilled' } : item)
    const nextRequests = requests.map((item) => item.category === listing?.category && item.status === 'Matched' ? { ...item, status: 'Fulfilled' } : item)
    saveLists(nextListings, nextRequests)
    notify('Handoff marked fulfilled — thanks for keeping it in use')
  }

  function submitForm(event) {
    event.preventDefault()
    if (modal === 'listing') {
      const listing = { id: `l-${Date.now()}`, name: form.name.trim(), category: form.category, quantity: Number(form.quantity), condition: form.condition, location: form.location.trim() || 'Campus pickup · confirm in chat', campus: 'Northbridge University', status: 'Available', note: form.note.trim() || 'Ready for a new home', icon: 'package' }
      saveLists([listing, ...listings], requests)
      setPage('listings')
      notify('Surplus listing added — checking for a community match')
    } else if (modal === 'request') {
      const request = { id: `r-${Date.now()}`, organization: form.organization.trim(), item: form.name.trim(), category: form.category, quantity: Number(form.quantity), location: form.location.trim() || 'Nearby · distance to confirm', distanceKm: null, urgency: form.urgency, status: 'Open', initials: form.organization.trim().split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'NG', color: 'sage', note: form.note.trim() || 'Request added by a community partner' }
      saveLists(listings, [request, ...requests])
      setPage('requests')
      notify('Community need added — matching against available resources')
    }
    setModal(null)
    setForm({ name: '', category: 'Books', quantity: '', condition: 'Good', location: '', note: '', organization: '', urgency: 'Medium' })
  }

  function showOffer(listing, request) {
    setModal({ type: 'offer', listing, request })
  }

  const filteredListings = listings.filter((item) => {
    const queryMatch = `${item.name} ${item.category} ${item.location}`.toLowerCase().includes(search.toLowerCase())
    return queryMatch && (filter === 'All' || item.status === filter)
  })
  const filteredRequests = requests.filter((item) => {
    const queryMatch = `${item.organization} ${item.item} ${item.category}`.toLowerCase().includes(search.toLowerCase())
    return queryMatch && (filter === 'All' || item.status === filter || (filter === 'Available' && item.status === 'Open'))
  })

  const title = navItems.find((item) => item.key === page)?.label ?? 'Overview'

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); setPage('overview') }}>
          <span className="brand-mark"><IconArrowsExchange size={21} stroke={1.8} /></span>
          <span className="brand-word">commons<span className="brand-period">.</span><small>resource exchange</small></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch" onClick={() => setRoleMenu((current) => !current)} aria-expanded={roleMenu}>
          <span className="workspace-avatar">N</span>
          <span className="workspace-copy"><strong>Northbridge University</strong><small>{role}</small></span>
          <IconChevronDown size={16} />
        </button>
        {roleMenu && <div className="role-menu">
          {['Campus partner', 'Student donor', 'Community coordinator'].map((option) => <button key={option} onClick={() => { setRole(option); setRoleMenu(false); notify(`Viewing as ${option.toLowerCase()}`) }}><IconUsers size={16} />{option}{role === option && <IconCheck size={16} />}</button>)}
          <div className="role-menu-note">NGO identity review is simulated in this prototype.</div>
        </div>}

        <div className="workspace-label nav-label">YOUR SPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map(({ key, label, icon: Icon, count }) => <button key={key} className={`nav-item ${page === key ? 'nav-active' : ''}`} onClick={() => { setPage(key); setMobileNav(false) }}>
            <Icon size={19} stroke={1.7} /><span>{label}</span>{count && page !== key && <span className="nav-count">{Math.min(count, activeMatches.length)}</span>}
          </button>)}
        </nav>

        <div className="sidebar-bottom">
          <div className="impact-mini">
            <span className="impact-icon"><IconLeaf size={17} /></span>
            <span><strong>Small actions, shared impact</strong><small>{isDemo ? 'Sample exchange data' : 'Your community exchange'}</small></span>
            <IconArrowDownRight size={16} className="impact-arrow" />
          </div>
          <button className="nav-item"><IconSettings size={19} stroke={1.7} /><span>Settings</span></button>
          <button className="profile-row" onClick={() => setModal({ type: 'register' })}>
            <span className="profile-avatar">AM</span><span className="profile-copy"><strong>Alex Morgan</strong><small>Campus coordinator</small></span><IconChevronDown size={15} />
          </button>
        </div>
      </aside>

      {mobileNav && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileNav(false)} />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><IconMenu2 size={21} /></button>
            <div className="breadcrumb"><span>Northbridge University</span><IconChevronRight size={14} /><strong>{title}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="demo-indicator"><span className="status-dot" />{isDemo ? 'Demo workspace' : 'Production build'}</div>
            <button className="pitch-button transition-colors focus-visible:ring-2 focus-visible:ring-commons-forest" onClick={() => setPitchIndex(0)}><IconSparkles size={17} />Pitch mode</button>
            {installPrompt && <button className="install-button" onClick={installApp}>Install</button>}
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You’re all caught up')}><IconBell size={19} /><i /></button>
            {isDemo && <button className="reset-link" onClick={resetDemo}>Reset demo</button>}
          </div>
        </header>

        <div className="page-wrap">
          {page === 'overview' && <>
            <section className="welcome-row">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" />TUESDAY, NOVEMBER 17, 2026</div>
                <h1>A little less unused.<br /><span>A lot more shared.</span></h1>
                <p className="welcome-copy">Your campus has good things to give. Let’s get them where they can do good.</p>
              </div>
              <div className="welcome-actions">
                <button className="button button-secondary" onClick={() => setModal('request')}><IconHeartHandshake size={18} />Add a community need</button>
                <button className="button button-primary" onClick={() => setModal('listing')}><IconPlus size={18} />List surplus</button>
              </div>
            </section>

            {isDemo && <div className="demo-note"><IconSparkles size={16} /><span><strong>You’re in the sample workspace.</strong> Try the textbook match, offer the books, then mark the handoff complete.</span><button onClick={() => setPitchIndex(0)}>Open the 60-second tour <IconArrowRight size={15} /></button></div>}

            <section className="metrics-grid" aria-label="Community exchange summary">
              <Metric label="Ready to find a home" value={availableCount} suffix="listings" caption="Across books, devices and more" icon={IconPackage} tone="lime" />
              <Metric label="Matches to review" value={activeMatches.length} suffix="suggestions" caption="Based on fit, quantity and pickup" icon={IconArrowsExchange} tone="blue" />
              <Metric label="Offers in progress" value={offeredCount} suffix="handoffs" caption={`${fulfilledCount} completed so far`} icon={IconHeartHandshake} tone="peach" />
            </section>

            <section className="section-heading">
              <div><span className="section-kicker">THE RIGHT THING, THE RIGHT PLACE</span><h2>Best next match</h2></div>
              <button className="text-link" onClick={() => setPage('matches')}>View match board <IconArrowRight size={17} /></button>
            </section>

            {matchedPair ? <FeaturedMatch match={matchedPair} onOffer={showOffer} /> : <div className="empty-panel"><IconArrowsExchange size={25} /><strong>No suggestions yet</strong><span>Add a listing or a community need to start a match.</span></div>}

            <section className="overview-lower">
              <div className="panel activity-panel">
                <div className="panel-heading"><div><span className="section-kicker">IN YOUR CIRCLE</span><h3>Community needs</h3></div><button className="subtle-link" onClick={() => setPage('requests')}>See all <IconArrowRight size={15} /></button></div>
                <div className="need-list">
                  {requests.slice(0, 3).map((request) => <NeedRow key={request.id} request={request} />)}
                  {requests.length === 0 && <EmptyLine text="No requests yet. Add the first community need." />}
                </div>
              </div>
              <div className="panel impact-panel">
                <div className="impact-panel-top"><span className="circle-icon"><IconLeaf size={19} /></span><span className="live-label"><i /> COMMUNITY EXCHANGE</span></div>
                <h3>Impact grows<br />one handoff at a time.</h3>
                <p>Every completed exchange keeps something useful in circulation.</p>
                <div className="impact-rule" />
                <div className="impact-foot"><span><strong>{fulfilledCount}</strong><small>completed handoffs</small></span><span className="impact-foot-mark">↗</span></div>
                {isDemo && <div className="illustrative-note">Illustrative prototype data · not measured outcomes</div>}
              </div>
            </section>
          </>}

          {page === 'matches' && <>
            <PageIntro eyebrow="BETTER TOGETHER" title="Match board" text="Suggestions are ranked by category, quantity, condition and pickup proximity. A person always makes the final call." action={<button className="button button-primary" onClick={() => setModal('listing')}><IconPlus size={18} />List surplus</button>} />
            <div className="match-explainer"><IconSparkles size={18} /><span><strong>How matching works</strong> Category fit + enough quantity + usable condition + nearby pickup.</span><span className="rules-tag">RULE-BASED · EXPLAINABLE</span></div>
            <div className="match-stack">{activeMatches.map((match) => <FeaturedMatch key={`${match.listing.id}-${match.request.id}`} match={match} onOffer={showOffer} compact />)}</div>
            {activeMatches.length === 0 && <div className="empty-panel"><IconArrowsExchange size={25} /><strong>No current matches</strong><span>Try a broader category or add an item that meets a community need.</span></div>}
          </>}

          {page === 'listings' && <>
            <PageIntro eyebrow="GIVE IT ANOTHER LIFE" title="Surplus listings" text="Useful items on campus, ready for a new home." action={<button className="button button-primary" onClick={() => setModal('listing')}><IconPlus size={18} />List surplus</button>} />
            <ListControls search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={['All', 'Available', 'Requested', 'Fulfilled']} />
            <div className="listing-grid">{filteredListings.map((listing) => <ListingCard key={listing.id} listing={listing} requests={requests} onFulfill={fulfillListing} />)}</div>
            {filteredListings.length === 0 && <div className="empty-panel"><IconPackage size={25} /><strong>No listings to show</strong><span>Try another filter or add a surplus item.</span><button className="button button-primary" onClick={() => setModal('listing')}><IconPlus size={17} />Add first listing</button></div>}
          </>}

          {page === 'requests' && <>
            <PageIntro eyebrow="NEARBY, AND IN NEED" title="Community needs" text="Local organisations share what would help. Your campus can respond when it has a good fit." action={<button className="button button-primary" onClick={() => setModal('request')}><IconPlus size={18} />Add a need</button>} />
            <ListControls search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={['All', 'Open', 'Matched', 'Fulfilled']} />
            <div className="request-grid">{filteredRequests.map((request) => <RequestCard key={request.id} request={request} listings={listings} onOffer={showOffer} />)}</div>
            {filteredRequests.length === 0 && <div className="empty-panel"><IconHeartHandshake size={25} /><strong>No community needs yet</strong><span>Add a request to let nearby campuses know what would help.</span><button className="button button-primary" onClick={() => setModal('request')}><IconPlus size={17} />Add a community need</button></div>}
          </>}

          <footer className="page-footer"><span>commons. <i>Make useful things useful again.</i></span><span>{isDemo ? 'Sample data · local browser storage' : 'Clean build · connect an approved backend to go live'}</span></footer>
        </div>
      </main>

      {modal === 'listing' && <FormModal title="List a surplus item" intro="Give a useful item a second life in your community." icon={IconPackage} onClose={() => setModal(null)} onSubmit={submitForm}>
        <Field label="What do you have?" required><input autoFocus required minLength="2" placeholder="e.g. Used science books" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
        <div className="form-row"><Field label="Category" required><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{['Books', 'Devices', 'Food', 'Stationery', 'Furniture'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Quantity" required><input required min="1" type="number" placeholder="e.g. 12" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></Field></div>
        <div className="form-row"><Field label="Condition" required><select value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })}>{['New', 'Good', 'Refurbished', 'Fresh today', 'Used · fair'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Campus pickup point"><input placeholder="Building, room or desk" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></Field></div>
        <Field label="Anything else?"><textarea rows="2" placeholder="Details that help an organisation decide" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></Field>
      </FormModal>}

      {modal === 'request' && <FormModal title="Share a community need" intro="Tell nearby campuses what would make a difference." icon={IconHeartHandshake} onClose={() => setModal(null)} onSubmit={submitForm}>
        <Field label="Organisation name" required><input autoFocus required placeholder="e.g. Community learning centre" value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} /></Field>
        <Field label="What would help?" required><input required placeholder="e.g. Textbooks for secondary students" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
        <div className="form-row"><Field label="Category" required><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{['Books', 'Devices', 'Food', 'Stationery', 'Furniture'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Quantity needed" required><input required min="1" type="number" placeholder="e.g. 18" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></Field></div>
        <div className="form-row"><Field label="Neighbourhood"><input placeholder="Area or pickup location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></Field><Field label="Urgency"><select value={form.urgency} onChange={(event) => setForm({ ...form, urgency: event.target.value })}>{['Low', 'Medium', 'High'].map((item) => <option key={item}>{item}</option>)}</select></Field></div>
        <Field label="Context"><textarea rows="2" placeholder="Who will this support? When is it needed?" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></Field>
        <div className="verification-hint"><IconCircleCheck size={17} /><span>NGO identity review is <strong>simulated in this prototype.</strong> No registration number is stored or verified.</span></div>
      </FormModal>}

      {modal?.type === 'offer' && <OfferModal modal={modal} onClose={() => setModal(null)} onConfirm={() => offerMatch(modal.listing.id, modal.request.id)} />}
      {modal?.type === 'register' && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null) }}><section className="dialog registration-dialog" role="dialog" aria-modal="true" aria-labelledby="registration-title"><button className="dialog-close" aria-label="Close" onClick={() => setModal(null)}><IconX size={20} /></button><div className="dialog-icon"><IconBuildingCommunity size={21} /></div><span className="section-kicker">JOIN THE EXCHANGE</span><h2 id="registration-title">Bring your community in.</h2><p className="dialog-intro">Campuses and individuals can list directly. Community partners can register their organisation, then complete a human review before receiving requests.</p><label className="field-label">Account type<select className="registration-select" value={role} onChange={(event) => setRole(event.target.value)}><option>Campus partner</option><option>Student donor</option><option>Community coordinator</option></select></label><label className="field-label verification-field">NGO registration ID <span>optional · demo only</span><input placeholder="Connect an official verification provider" value={verificationId} onChange={(event) => setVerificationId(event.target.value)} disabled={role !== 'Community coordinator'} /></label><div className="verification-hint"><IconCircleCheck size={17} /><span>This prototype does not verify government records. A production rollout needs an approved verification provider and coordinator review.</span></div><button className="button button-primary button-full" onClick={() => { setVerificationRequested(true); notify(role === 'Community coordinator' ? 'Demo request saved — verification is not connected' : 'Your demo workspace is ready'); if (role !== 'Community coordinator') setModal(null) }}>{role === 'Community coordinator' ? 'Request review' : 'Continue to workspace'}<IconArrowRight size={17} /></button>{verificationRequested && <p className="form-confirmation">Request noted for this session. No ID was sent or checked.</p>}</section></div>}

      {pitchIndex >= 0 && <PitchMode index={pitchIndex} onChange={setPitchIndex} onClose={() => setPitchIndex(-1)} onOpenMatch={() => { setPitchIndex(-1); setPage('matches') }} />}
      {toast && <div className="toast" role="status"><IconCircleCheck size={19} />{toast}</div>}
    </div>
  )
}

function Metric({ label, value, suffix, caption, icon: Icon, tone }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={18} /></span></div><div className="metric-value">{formatQuantity(value)} <small>{suffix}</small></div><div className="metric-caption">{caption}</div></div>
}

function PageIntro({ eyebrow, title, text, action }) {
  return <section className="page-intro"><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</section>
}

function ListControls({ search, setSearch, filter, setFilter, options }) {
  return <div className="list-controls"><label className="search-field"><IconSearch size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items, categories or groups" aria-label="Search listings" /><kbd>⌘ K</kbd></label><label className="filter-select"><IconFilter size={17} /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by status">{options.map((item) => <option key={item}>{item}</option>)}</select><IconChevronDown size={15} /></label></div>
}

function FeaturedMatch({ match, onOffer, compact = false }) {
  const { listing, request, score } = match
  const CategoryIcon = categoryIcon[listing.category] ?? IconPackage
  const busy = listing.status !== 'Available' || request.status !== 'Open'
  return <article className={`featured-match ${compact ? 'featured-compact' : ''}`}>
    <div className="match-topline"><span className="fit-badge"><IconSparkles size={15} />{Math.min(score || 95, 99)}% fit</span><span className="match-reason">{matchReason(listing, request)}</span><button className="match-more" aria-label={`More about ${listing.name}`}><IconChevronDown size={18} /></button></div>
    <div className="match-main">
      <div className="match-item-side"><div className="match-item-icon"><CategoryIcon size={23} stroke={1.6} /></div><div><span className="item-type">CAMPUS HAS</span><h3>{listing.name}</h3><p>{listing.quantity} available <span>·</span> {listing.condition}</p><div className="location-line"><IconMapPin size={15} />{listing.location}</div></div></div>
      <div className="match-connector"><span><IconArrowsExchange size={20} /></span><i /><small>GOOD FIT</small></div>
      <div className="match-need-side"><span className={`org-avatar ${request.color}`}>{request.initials}</span><div><span className="item-type">COMMUNITY NEEDS</span><h3>{request.item}</h3><p><strong>{request.organization}</strong><span> · </span>{request.quantity} needed</p><div className="location-line"><IconMapPin size={15} />{request.location}</div></div></div>
      <div className="match-cta"><button className={`button ${busy ? 'button-muted' : 'button-primary'}`} disabled={busy} onClick={() => onOffer(listing, request)}>{busy ? (listing.status === 'Fulfilled' ? 'Fulfilled' : 'Offer in progress') : 'Offer this item'}{!busy && <IconArrowRight size={17} />}</button><span>{busy ? 'Status updates as the handoff moves forward' : 'You’ll confirm pickup details next'}</span></div>
    </div>
  </article>
}

function NeedRow({ request }) {
  return <div className="need-row"><span className={`org-avatar ${request.color}`}>{request.initials}</span><div className="need-row-content"><strong>{request.organization}</strong><span>{request.item}</span></div><span className={`urgency urgency-${request.urgency.toLowerCase()}`}>{request.urgency}</span><span className={`status status-${request.status.toLowerCase()}`}>{request.status}</span></div>
}

function ListingCard({ listing, requests, onFulfill }) {
  const CategoryIcon = categoryIcon[listing.category] ?? IconPackage
  const request = requests.find((item) => item.category === listing.category && item.status !== 'Fulfilled')
  return <article className="listing-card"><div className="listing-card-head"><span className="listing-icon"><CategoryIcon size={21} stroke={1.6} /></span><span className={`status status-${listing.status.toLowerCase()}`}>{listing.status}</span></div><span className="item-type">{listing.category.toUpperCase()}</span><h3>{listing.name}</h3><p className="listing-note">{listing.note}</p><div className="listing-meta"><span><IconPackage size={15} />{listing.quantity} units</span><span>{listing.condition}</span></div><div className="listing-location"><IconMapPin size={15} />{listing.location}</div>{request && <div className="listing-fit"><IconSparkles size={15} /><span>Potential fit for <strong>{request.organization}</strong></span></div>}{listing.status === 'Requested' && <button className="button button-primary button-full" onClick={() => onFulfill(listing.id)}><IconCheck size={17} />Mark handoff fulfilled</button>}{listing.status === 'Fulfilled' && <div className="fulfilled-note"><IconCircleCheck size={17} />A useful thing, still in use.</div>}</article>
}

function RequestCard({ request, listings, onOffer }) {
  const CategoryIcon = categoryIcon[request.category] ?? IconPackage
  const candidates = listings.filter((item) => matchScore(item, request) > 0)
  const best = candidates[0]
  const offered = request.status === 'Matched' ? listings.find((item) => item.category === request.category && item.status === 'Requested') : null
  return <article className="request-card"><div className="request-card-head"><span className={`org-avatar org-avatar-large ${request.color}`}>{request.initials}</span><span className={`status status-${request.status.toLowerCase()}`}>{request.status}</span></div><h3>{request.organization}</h3><span className="request-item"><CategoryIcon size={17} />{request.item}</span><p>{request.note}</p><div className="request-meta"><span><IconPackage size={15} />{request.quantity} wanted</span><span className={`urgency urgency-${request.urgency.toLowerCase()}`}>{request.urgency} priority</span></div><div className="listing-location"><IconMapPin size={15} />{request.location}</div>{best ? <div className="request-fit"><div><IconSparkles size={16} /><span><strong>{best.name}</strong><small>{matchReason(best, request)}</small></span></div><button disabled={request.status !== 'Open'} aria-label={`Offer ${best.name}`} onClick={() => onOffer(best, request)}><IconArrowRight size={18} /></button></div> : offered ? <div className="request-fit"><div><IconCircleCheck size={16} /><span><strong>{offered.name}</strong><small>Offer received · handoff being coordinated</small></span></div></div> : <div className="request-wait"><IconClock size={16} />Waiting for a suitable listing</div>}</article>
}

function EmptyLine({ text }) { return <div className="empty-line">{text}</div> }

function Field({ label, children, required = false }) {
  return <label className="field-label">{label}{required && <span className="required-mark">*</span>}{children}</label>
}

function FormModal({ title, intro, icon: Icon, onClose, onSubmit, children }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="form-modal-title"><button className="dialog-close" aria-label="Close" onClick={onClose}><IconX size={20} /></button><div className="dialog-icon"><Icon size={21} /></div><span className="section-kicker">COMMONS EXCHANGE</span><h2 id="form-modal-title">{title}</h2><p className="dialog-intro">{intro}</p><form onSubmit={onSubmit}><div className="form-fields">{children}</div><div className="dialog-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">Save and find a match <IconArrowRight size={17} /></button></div></form></section></div>
}

function OfferModal({ modal, onClose, onConfirm }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="dialog offer-dialog" role="dialog" aria-modal="true" aria-labelledby="offer-title"><button className="dialog-close" aria-label="Close" onClick={onClose}><IconX size={20} /></button><div className="dialog-icon"><IconHeartHandshake size={21} /></div><span className="section-kicker">A GOOD THING IN MOTION</span><h2 id="offer-title">Offer this item?</h2><p className="dialog-intro">We’ll connect your campus listing with this community request. Pickup details can be coordinated after the offer.</p><div className="offer-summary"><div><span className="item-type">YOUR SURPLUS</span><strong>{modal.listing.name}</strong><small>{modal.listing.quantity} · {modal.listing.location}</small></div><IconArrowsExchange size={19} /><div><span className="item-type">COMMUNITY PARTNER</span><strong>{modal.request.organization}</strong><small>{modal.request.quantity} wanted · {modal.request.location}</small></div></div><div className="human-review"><IconUsers size={17} /><span>The donor and coordinator stay in control of the handoff. Commons suggests; people decide.</span></div><div className="dialog-actions"><button className="button button-secondary" onClick={onClose}>Not yet</button><button className="button button-primary" onClick={onConfirm}>Confirm offer <IconArrowRight size={17} /></button></div></section></div>
}

function PitchMode({ index, onChange, onClose, onOpenMatch }) {
  const slide = pitchSlides[index]
  const last = index === pitchSlides.length - 1
  return <div className="pitch-backdrop"><div className={`pitch-sheet pitch-${slide.color}`} role="dialog" aria-modal="true" aria-label="Commons pitch mode"><header className="pitch-header"><a className="brand pitch-brand" href="#pitch" onClick={(event) => event.preventDefault()}><span className="brand-mark"><IconArrowsExchange size={21} /></span><span className="brand-word">commons<span className="brand-period">.</span><small>resource exchange</small></span></a><div className="pitch-header-right"><span>JUDGE SHOWCASE</span><button className="icon-button" aria-label="Exit pitch mode" onClick={onClose}><IconX size={21} /></button></div></header><div className="pitch-content"><div className="pitch-copy"><span className="pitch-eyebrow"><i />{slide.eyebrow} <span>·</span> 0{index + 1}</span><h1>{slide.title}</h1><p>{slide.body}</p><div className="pitch-stat"><span className="pitch-stat-icon"><IconLeaf size={20} /></span>{slide.stat}</div><div className="pitch-cue"><span>YOUR TALK TRACK</span><p>{slide.cue}</p></div><div className="pitch-navigation"><button className="pitch-back" onClick={() => index === 0 ? onClose() : onChange(index - 1)}>{index === 0 ? 'Exit pitch' : <><IconChevronLeft size={17} />Back</>}</button><div className="pitch-dots">{pitchSlides.map((item, dot) => <button key={item.eyebrow} className={dot === index ? 'pitch-dot pitch-dot-active' : 'pitch-dot'} aria-label={`Go to slide ${dot + 1}`} onClick={() => onChange(dot)} />)}</div>{last ? <button className="button button-primary" onClick={onOpenMatch}>Show live match <IconArrowRight size={17} /></button> : <button className="button button-primary" onClick={() => onChange(index + 1)}>Continue <IconArrowRight size={17} /></button>}</div></div><div className="pitch-visual"><div className="pitch-orbit orbit-one" /><div className="pitch-orbit orbit-two" /><div className="pitch-visual-center"><span><IconArrowsExchange size={39} stroke={1.5} /></span><small>CAMPUS SURPLUS</small><i /><small>COMMUNITY NEED</small></div><div className="pitch-floating pitch-floating-top"><IconBook2 size={18} />{DEMO_MODE ? '24 textbooks' : 'Useful surplus'}<span>{DEMO_MODE ? 'READY TO SHARE' : 'READY TO LIST'}</span></div><div className="pitch-floating pitch-floating-bottom"><span className="org-avatar sage">{DEMO_MODE ? 'BL' : 'NG'}</span><div><strong>{DEMO_MODE ? 'BrightPath Learning' : 'Community partner'}</strong><small>{DEMO_MODE ? '18 books needed nearby' : 'Needs and offers connect here'}</small></div><IconCheck size={17} /></div><div className="pitch-visual-tag"><IconSparkles size={15} /> {DEMO_MODE && index === 2 ? 'A 95% explainable fit' : 'Local needs, made visible'}</div></div></div></div></div>
}

export default App
