export const seedListings = [
  { id: 'l1', name: 'First-year biology textbooks', category: 'Books', quantity: 24, condition: 'Good', location: 'Science block · Room 204', campus: 'Northbridge University', status: 'Available', note: 'Latest edition, gently used', icon: 'book' },
  { id: 'l2', name: 'Reconditioned laptops', category: 'Devices', quantity: 6, condition: 'Refurbished', location: 'IT services · Desk 3', campus: 'Northbridge University', status: 'Available', note: 'Chargers included', icon: 'device' },
  { id: 'l3', name: 'Cafeteria meal packs', category: 'Food', quantity: 18, condition: 'Fresh today', location: 'Student centre · Loading bay', campus: 'Northbridge University', status: 'Requested', note: 'Pickup before 2:00 pm', icon: 'food' },
  { id: 'l4', name: 'Art and stationery kits', category: 'Stationery', quantity: 15, condition: 'New', location: 'Arts building · Store room', campus: 'Northbridge University', status: 'Available', note: 'Notebooks, pencils, colour sets', icon: 'package' },
]

export const seedRequests = [
  { id: 'r1', organization: 'BrightPath Learning Centre', item: 'Textbooks for secondary students', category: 'Books', quantity: 18, location: 'Kothrud · 2.4 km away', distanceKm: 2.4, urgency: 'High', status: 'Open', initials: 'BL', color: 'sage', note: 'Science and maths books, grades 9–12' },
  { id: 'r2', organization: 'Sankalp Community Hub', item: 'Laptops for a digital skills lab', category: 'Devices', quantity: 8, location: 'Warje · 4.1 km away', distanceKm: 4.1, urgency: 'Medium', status: 'Open', initials: 'SC', color: 'peach', note: 'Any working laptop with a charger' },
  { id: 'r3', organization: 'Meals for All Pune', item: 'Ready-to-eat meal packs', category: 'Food', quantity: 20, location: 'Deccan · 1.8 km away', distanceKm: 1.8, urgency: 'High', status: 'Matched', initials: 'MA', color: 'blue', note: 'Vegetarian meals for today’s outreach' },
  { id: 'r4', organization: 'Udaan After-School Club', item: 'Art supplies and notebooks', category: 'Stationery', quantity: 12, location: 'Karve Nagar · 3.2 km away', distanceKm: 3.2, urgency: 'Low', status: 'Open', initials: 'UA', color: 'lilac', note: 'For a weekend creative learning session' },
]
